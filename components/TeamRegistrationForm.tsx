'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchCompetitors } from '@/lib/actions/user';
import { submitRegistrationCart } from '@/lib/actions/registration';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { X, Plus, CheckCircle2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TeamRegistrationFormProps {
  userId: string;
  userRole: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'SKIER_AND_SNOWBOARDER' | 'RIDER_SKIER_SNOWBOARDER';
  isLightMode?: boolean;
  initialTeams?: Team[];
}

interface Team {
  id: number;
  partnerId: string;
  partnerName: string;
  horseName: string;
  horseOwner: string;
  selectedRole?: 'RIDER' | 'SKIER' | 'SNOWBOARDER';
  division?: 'NOVICE' | 'SPORT' | 'OPEN' | 'SNOWBOARD';
}

interface SearchResult {
  id: string;
  fullName: string;
  email: string;
  competitorType: string;
}

import { WAIVER_TEXT } from '@/constants';

const TeamRegistrationForm = ({ userId, userRole, isLightMode = false, initialTeams }: TeamRegistrationFormProps) => {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>(initialTeams || [{ id: 1, partnerId: '', partnerName: '', horseName: '', horseOwner: '', selectedRole: undefined, division: undefined }]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchingForTeamId, setSearchingForTeamId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState<{ query: string, teamId: number | null }>({ query: '', teamId: null });
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [waiverAgreed, setWaiverAgreed] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(`registration_form_state_${userId}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only use localStorage if we didn't provide initialTeams (DB data takes precedence)
        if (!initialTeams && parsed.teams) setTeams(parsed.teams);
        if (parsed.waiverAgreed !== undefined) setWaiverAgreed(parsed.waiverAgreed);
        if (parsed.guardianName) setGuardianName(parsed.guardianName);
        if (parsed.guardianPhone) setGuardianPhone(parsed.guardianPhone);
      } catch (e) {
        console.error("Failed to load saved form state", e);
      }
    }
    setIsLoaded(true);
  }, [userId, initialTeams]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save initial empty state before loading
    const stateToSave = {
      teams,
      waiverAgreed,
      guardianName,
      guardianPhone
    };
    localStorage.setItem(`registration_form_state_${userId}`, JSON.stringify(stateToSave));
  }, [teams, waiverAgreed, guardianName, guardianPhone, userId, isLoaded]);

  const textColor = isLightMode ? 'text-black' : 'text-white';
  const borderColor = isLightMode ? 'border-black/20' : 'border-white/20';
  const hoverBorderColor = isLightMode ? 'hover:border-black/50' : 'hover:border-white/50';
  const bgColor = isLightMode ? 'bg-white' : 'bg-white/5';
  const inputBg = 'bg-transparent';
  const placeholderColor = isLightMode ? 'placeholder:text-black/50' : 'placeholder:text-white/50';
  const focusRing = isLightMode ? 'focus:ring-black/20' : 'focus:ring-white/20';
  const focusBorder = isLightMode ? 'focus:border-black' : 'focus:border-white';

  const addTeam = () => {
    if (teams.length >= 7) {
      toast.error('Maximum 7 teams allowed');
      return;
    }
    setTeams([...teams, { id: Date.now(), partnerId: '', partnerName: '', horseName: '', horseOwner: '', selectedRole: undefined, division: undefined }]);
  };

  const removeTeam = (id: number) => {
    toast("Are you sure you want to delete this team?", {
      action: {
        label: "Delete",
        onClick: () => setTeams((prev) => prev.filter((t) => t.id !== id)),
      },
    });
  };

  const updateTeam = (id: number, field: keyof Team, value: string) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSearch = async (query: string, teamId: number) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchingForTeamId(teamId);
    
    const team = teams.find(t => t.id === teamId);
    const currentRole = team?.selectedRole || userRole;

    // If I am acting as RIDER, I need a SKIER/SNOWBOARDER partner.
    // If I am acting as SKIER/SNOWBOARDER, I need a RIDER partner.
    const targetType = (currentRole === 'RIDER') ? 'SKIER' : 'RIDER';
    
    const results = await searchCompetitors(query, targetType, userId);
    setSearchResults(results);
  };

  useEffect(() => {
    if (debouncedSearchQuery.teamId !== null) {
      handleSearch(debouncedSearchQuery.query, debouncedSearchQuery.teamId);
    }
  }, [debouncedSearchQuery]);

  const selectPartner = (teamId: number, partner: SearchResult) => {
    updateTeam(teamId, 'partnerId', partner.id);
    updateTeam(teamId, 'partnerName', partner.fullName);
    setSearchingForTeamId(null);
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    // Validate
    if (!waiverAgreed) {
      toast.error('You must agree to the waiver');
      return;
    }

    for (const team of teams) {
      const currentRole = team.selectedRole || userRole;
      
      // Check if role selection is required but missing
      if ((userRole === 'RIDER_SKIER_SNOWBOARDER' || userRole === 'SKIER_AND_SNOWBOARDER') && !team.selectedRole) {
        toast.error('Please select your role for all teams');
        return;
      }

      if (!team.division) {
        toast.error('Please select a division for all teams');
        return;
      }

      if (!team.partnerId) {
        if (team.partnerName) {
          toast.error(`Please select a valid partner from the search results for Team ${team.id}`);
        } else {
          toast.error(`Please select a partner for Team ${team.id}`);
        }
        return;
      }
      
      if (currentRole === 'RIDER') {
        if (!team.horseName || !team.horseOwner) {
          toast.error('Please enter Horse Name and Horse Owner for all teams where you are the Rider');
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const formattedTeams = teams.map((t) => {
        const currentRole = t.selectedRole || userRole;
        return {
          riderId: currentRole === 'RIDER' ? userId : t.partnerId,
          skierId: currentRole !== 'RIDER' ? userId : t.partnerId,
          horseName: t.horseName,
          horseOwner: t.horseOwner,
          division: t.division,
        };
      });

      const result = await submitRegistrationCart(userId, formattedTeams, {
        waiverAgreed,
        guardianName,
        guardianPhone,
      });
      if (result.success) {
        toast.success('Added to cart successfully!');
        router.push('/registration-cart'); // Redirect to cart summary
      } else {
        toast.error(result.error || 'Submission failed');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className={`p-6 border ${borderColor} ${hoverBorderColor} transition-colors duration-50 rounded-lg ${bgColor} backdrop-blur-sm space-y-4 relative`}>
        <h2 className={`text-xl font-bold text-center ${textColor}`}>Whitefish Skijoring Individual Registration (2026)</h2>
        <p className={`text-sm ${isLightMode ? 'text-black/70' : 'text-white/70'} text-center`}>
          <strong className={textColor}>COMPETITOR Whitefish Skijoring, Whitefish MT WAIVER AND RELEASE FORM</strong>
          <br />
          Please read entire form carefully before signing.
        </p>
        
        <div className={`h-96 overflow-y-auto border ${borderColor} p-4 rounded bg-white text-base whitespace-pre-wrap text-black`}>
          {WAIVER_TEXT}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="waiver" checked={waiverAgreed} onCheckedChange={(c) => setWaiverAgreed(c as boolean)} className={`${isLightMode ? 'border-black/50 data-[state=checked]:bg-black data-[state=checked]:text-white' : 'border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black'} cursor-pointer`} />
          <Label htmlFor="waiver" className={`font-bold ${textColor} cursor-pointer`}>I agree to all of the above *</Label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="guardianName" className={textColor}>Guardian Name (if applicable)</Label>
                <Input 
                  id="guardianName" 
                  value={guardianName} 
                  onChange={(e) => setGuardianName(e.target.value)} 
                  placeholder="Guardian Name" 
                  className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors`}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="guardianPhone" className={textColor}>Guardian Phone Number</Label>
                <Input 
                  id="guardianPhone" 
                  value={guardianPhone} 
                  onChange={(e) => setGuardianPhone(e.target.value)} 
                  placeholder="Phone Number" 
                  className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors`}
                />
            </div>
        </div>
      </div>

      {teams.map((team, index) => (
        <div key={team.id} className={`p-6 border ${borderColor} ${hoverBorderColor} transition-colors duration-50 rounded-lg ${bgColor} backdrop-blur-sm space-y-4 relative`}>
          <div className="flex justify-between items-center">
            <h3 className={`font-bold ${textColor} text-xl`}>
              Team {index + 1} {!team.selectedRole && <span className={`text-sm font-normal ${isLightMode ? 'text-black/60' : 'text-white/60'}`}>(Me: {userRole})</span>}
            </h3>
            {teams.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeTeam(team.id)} className={`hover:${isLightMode ? 'bg-black/10 text-black hover:text-black/80' : 'bg-white/10 text-white hover:text-white/80'}`}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className={textColor}>Select Division</Label>
                <Select value={team.division} onValueChange={(v: 'NOVICE' | 'SPORT' | 'OPEN' | 'SNOWBOARD') => updateTeam(team.id, 'division', v)}>
                    <SelectTrigger className={`${inputBg} ${borderColor} ${textColor} data-placeholder:${textColor} ${focusRing} ${hoverBorderColor} transition-colors cursor-pointer`}>
                        <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent className={`${isLightMode ? 'bg-white border-black/20 text-black' : 'bg-black border-white/20 text-white'}`}>
                        <SelectItem value="NOVICE" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>1. Novice</SelectItem>
                        <SelectItem value="SPORT" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>2. Sport</SelectItem>
                        <SelectItem value="OPEN" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>3. Open</SelectItem>
                        <SelectItem value="SNOWBOARD" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>4. Snowboard</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {(userRole === 'RIDER_SKIER_SNOWBOARDER' || userRole === 'SKIER_AND_SNOWBOARDER') && (
              <div className="space-y-2">
                <Label className={textColor}>I am competing as:</Label>
                <Select 
                  value={team.selectedRole} 
                  onValueChange={(v: 'RIDER' | 'SKIER' | 'SNOWBOARDER') => {
                    // Reset partner and horse info when role changes
                    setTeams(teams.map(t => t.id === team.id ? { 
                      ...t, 
                      selectedRole: v, 
                      partnerId: '', 
                      partnerName: '', 
                      horseName: '', 
                      horseOwner: '' 
                    } : t));
                    setSearchResults([]);
                    setSearchingForTeamId(null);
                  }}
                >
                  <SelectTrigger className={`${inputBg} ${borderColor} ${textColor} data-placeholder:${textColor} ${focusRing} ${hoverBorderColor} transition-colors cursor-pointer`}>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className={`${isLightMode ? 'bg-white border-black/20 text-black' : 'bg-black border-white/20 text-white'}`}>
                    {userRole === 'RIDER_SKIER_SNOWBOARDER' && (
                      <SelectItem value="RIDER" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>Rider</SelectItem>
                    )}
                    <SelectItem value="SKIER" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>Skier</SelectItem>
                    <SelectItem value="SNOWBOARDER" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>Snowboarder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="relative space-y-2">
              <Label className={textColor}>
                {(team.selectedRole === 'RIDER' || (!team.selectedRole && userRole === 'RIDER')) 
                  ? 'Partner (Skier/Snowboarder)' 
                  : 'Partner (Rider)'}
              </Label>
              <div className="relative">
                <Input
                  placeholder={`Search ${(team.selectedRole === 'RIDER' || (!team.selectedRole && userRole === 'RIDER')) ? 'partner' : 'rider'}...`}
                  value={team.partnerName}
                  onChange={(e) => {
                    updateTeam(team.id, 'partnerName', e.target.value);
                    updateTeam(team.id, 'partnerId', ''); // Clear partner ID when typing to ensure valid selection
                    setSearchQuery({ query: e.target.value, teamId: team.id });
                  }}
                  className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors pr-10`}
                />
                {team.partnerId && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
              {searchingForTeamId === team.id && searchResults.length > 0 && (
                <div className={`absolute z-10 w-full ${isLightMode ? 'bg-white border-black/20' : 'bg-zinc-900 border-white/20'} border rounded-md shadow-xl mt-1 max-h-40 overflow-y-auto`}>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 ${isLightMode ? 'hover:bg-black/10 text-black' : 'hover:bg-white/10 text-white'} cursor-pointer transition-colors`}
                      onClick={() => selectPartner(team.id, user)}
                    >
                      <div className="font-medium">{user.fullName}</div>
                      <div className={`text-xs ${isLightMode ? 'text-black/50' : 'text-white/50'}`}>{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(team.selectedRole === 'RIDER' || (!team.selectedRole && userRole === 'RIDER')) && (
              <>
                <div className="space-y-2">
                  <Label className={textColor}>Horse Name</Label>
                  <Input
                    placeholder="Enter horse name"
                    value={team.horseName}
                    onChange={(e) => updateTeam(team.id, 'horseName', e.target.value)}
                    className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors`}
                  />
                </div>

                <div className="space-y-2">
                  <Label className={textColor}>Horse Owner</Label>
                  <Input
                    placeholder="Enter horse owner"
                    value={team.horseOwner}
                    onChange={(e) => updateTeam(team.id, 'horseOwner', e.target.value)}
                    className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors`}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-4 pt-4">
        <Button 
          onClick={addTeam} 
          variant="outline" 
          disabled={teams.length >= 7}
          className={`${inputBg} ${isLightMode ? 'border-black text-black hover:bg-black hover:text-white' : 'border-white text-white hover:bg-white hover:text-black'} cursor-pointer`}
        >
          Add Another Team
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={submitting} 
          className={`flex-1 ${isLightMode ? 'bg-black text-white hover:bg-black/90' : 'bg-white text-black hover:bg-white/90'} font-semibold cursor-pointer`}
        >
          {submitting ? 'Adding...' : 'Submit to Registration Cart'}
        </Button>
      </div>
    </div>
  );
};

export default TeamRegistrationForm;