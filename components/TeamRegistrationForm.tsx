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
import { X, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TeamRegistrationFormProps {
  userId: string;
  userRole: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'SKIER_AND_SNOWBOARDER' | 'RIDER_AND_SKIER_SNOWBOARDER';
  isLightMode?: boolean;
}

interface Team {
  id: number;
  partnerId: string;
  partnerName: string;
  horseName: string;
  teamName: string;
}

interface Horse {
  id: number;
  name: string;
  bio: string;
}

interface SearchResult {
  id: string;
  fullName: string;
  email: string;
  competitorType: string;
}

import { WAIVER_TEXT } from '@/constants';

const TeamRegistrationForm = ({ userId, userRole, isLightMode = false }: TeamRegistrationFormProps) => {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([{ id: 1, partnerId: '', partnerName: '', horseName: '', teamName: '' }]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchingForTeamId, setSearchingForTeamId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState<{ query: string, teamId: number | null }>({ query: '', teamId: null });
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [waiverAgreed, setWaiverAgreed] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [division, setDivision] = useState<'NOVICE' | 'SPORT' | 'OPEN' | undefined>(undefined);

  // Horse Logic
  const [horseOwner, setHorseOwner] = useState('');
  const [horses, setHorses] = useState<Horse[]>([{ id: Date.now(), name: '', bio: '' }]);

  const textColor = isLightMode ? 'text-black' : 'text-white';
  const borderColor = isLightMode ? 'border-black/20' : 'border-white/20';
  const hoverBorderColor = isLightMode ? 'hover:border-black/50' : 'hover:border-white/50';
  const bgColor = isLightMode ? 'bg-white' : 'bg-white/5';
  const inputBg = 'bg-transparent';
  const placeholderColor = isLightMode ? 'placeholder:text-black/50' : 'placeholder:text-white/50';
  const focusRing = isLightMode ? 'focus:ring-black/20' : 'focus:ring-white/20';
  const focusBorder = isLightMode ? 'focus:border-black' : 'focus:border-white';

  const addHorse = () => {
    if (horses.length >= 4) {
      toast.error('Maximum 4 horses allowed');
      return;
    }
    setHorses([...horses, { id: Date.now(), name: '', bio: '' }]);
  };

  const removeHorse = (id: number) => {
    if (horses.length <= 1) {
      toast.error('You must have at least one horse');
      return;
    }
    setHorses(horses.filter(h => h.id !== id));
  };

  const updateHorse = (id: number, field: keyof Horse, value: string) => {
    setHorses(horses.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const addTeam = () => {
    if (teams.length >= 4) {
      toast.error('Maximum 4 teams allowed');
      return;
    }
    setTeams([...teams, { id: Date.now(), partnerId: '', partnerName: '', horseName: '', teamName: '' }]);
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
    setTeams(teams.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSearch = async (query: string, teamId: number) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchingForTeamId(teamId);
    // If I am a RIDER or RIDER_AND_SKIER_SNOWBOARDER, set form for SKIER (which now means any non-rider).
    // If I am not a RIDER, set form for RIDER.
    const targetType = (userRole === 'RIDER' || userRole === 'RIDER_AND_SKIER_SNOWBOARDER') ? 'SKIER' : 'RIDER';
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
    if ((userRole === 'SKIER' || userRole === 'SNOWBOARDER' || userRole === 'SKIER_AND_SNOWBOARDER' || userRole === 'RIDER_AND_SKIER_SNOWBOARDER') && !division) {
      toast.error('Please select a division');
      return;
    }

    if (userRole === 'RIDER' || userRole === 'RIDER_AND_SKIER_SNOWBOARDER') {
      if (!horseOwner) {
        toast.error('Please enter the horse owner name');
        return;
      }
      for (const horse of horses) {
        if (!horse.name) {
          toast.error('Please enter a name for all horses');
          return;
        }
      }
    }

    for (const team of teams) {
      if (!team.partnerId || !team.teamName) {
        toast.error('Please complete all team details (Partner and Team Name)');
        return;
      }
      if (userRole === 'RIDER' && !team.horseName) {
        toast.error('Please select a horse for all teams');
        return;
      }
    }

    setSubmitting(true);
    try {
      const formattedTeams = teams.map((t) => ({
        riderId: userRole === 'RIDER' ? userId : t.partnerId,
        skierId: userRole !== 'RIDER' ? userId : t.partnerId,
        horseName: t.horseName, // Can be empty if Skier
        teamName: t.teamName,
      }));

      const result = await submitRegistrationCart(userId, formattedTeams, {
        waiverAgreed,
        guardianName,
        guardianPhone,
        division,
        horseOwner,
        horses: horses.map(h => ({ name: h.name, bio: h.bio })),
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

        {(userRole === 'SKIER' || userRole === 'SNOWBOARDER' || userRole === 'SKIER_AND_SNOWBOARDER') && (
            <div className="space-y-2">
                <Label className={textColor}>Select Division</Label>
                <Select value={division} onValueChange={(v: 'NOVICE' | 'SPORT' | 'OPEN') => setDivision(v)}>
                    <SelectTrigger className={`${inputBg} ${borderColor} ${textColor} data-placeholder:${textColor} ${focusRing} ${hoverBorderColor} transition-colors cursor-pointer`}>
                        <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent className={`${isLightMode ? 'bg-white border-black/20 text-black' : 'bg-black border-white/20 text-white'}`}>
                        <SelectItem value="NOVICE" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>1. Novice</SelectItem>
                        <SelectItem value="SPORT" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>2. Sport</SelectItem>
                        <SelectItem value="OPEN" className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>3. Open</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        )}
      </div>

      {userRole === 'RIDER' && (
        <div className={`p-6 border ${borderColor} ${hoverBorderColor} transition-colors duration-50 rounded-lg ${bgColor} backdrop-blur-sm space-y-4 relative`}>
          <h3 className={`font-bold ${textColor} text-xl`}>Horse Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="horseOwner" className={textColor}>Horse Owner</Label>
            <Input 
              id="horseOwner" 
              value={horseOwner} 
              onChange={(e) => setHorseOwner(e.target.value)} 
              placeholder="Enter horse owner name" 
              className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors`}
            />
          </div>

          <div className="space-y-4">
            <Label className={textColor}>My Horses (Max 4)</Label>
            {horses.map((horse, index) => (
              <div key={horse.id} className={`grid gap-4 p-4 border ${isLightMode ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/5'} rounded-md`}>
                <div className="flex justify-between items-center">
                  <Label className={textColor}>Horse {index + 1}</Label>
                  {horses.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeHorse(horse.id)} className={`hover:${isLightMode ? 'bg-black/10 text-black hover:text-black/80' : 'bg-white/10 text-white hover:text-white/80'} h-6 w-6`}>
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className={`text-xs ${isLightMode ? 'text-black/70' : 'text-white/70'}`}>Name *</Label>
                    <Input
                      value={horse.name}
                      onChange={(e) => updateHorse(horse.id, 'name', e.target.value)}
                      placeholder="Horse Name"
                      className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={`text-xs ${isLightMode ? 'text-black/70' : 'text-white/70'}`}>Bio (Optional)</Label>
                    <Textarea
                      value={horse.bio}
                      onChange={(e) => updateHorse(horse.id, 'bio', e.target.value)}
                      placeholder="Tell us about your horse..."
                      className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors min-h-10`}
                    />
                  </div>
                </div>
              </div>
            ))}
            {horses.length < 4 && (
              <Button onClick={addHorse} variant="outline" size="sm" className={`${inputBg} ${isLightMode ? 'border-black text-black hover:bg-black hover:text-white' : 'border-white text-white hover:bg-white hover:text-black'} cursor-pointer`}>
                <Plus className="h-4 w-4 mr-2" /> Add Horse
              </Button>
            )}
          </div>
        </div>
      )}

      {teams.map((team, index) => (
        <div key={team.id} className={`p-6 border ${borderColor} ${hoverBorderColor} transition-colors duration-50 rounded-lg ${bgColor} backdrop-blur-sm space-y-4 relative`}>
          <div className="flex justify-between items-center">
            <h3 className={`font-bold ${textColor} text-xl`}>Team {index + 1}</h3>
            {teams.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeTeam(team.id)} className={`hover:${isLightMode ? 'bg-black/10 text-black hover:text-black/80' : 'bg-white/10 text-white hover:text-white/80'}`}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={textColor}>You ({userRole})</Label>
              <Input 
                disabled 
                value="Me" 
                className={`${inputBg} ${borderColor} ${isLightMode ? 'text-black/70' : 'text-white/70'} cursor-not-allowed`} 
              />
            </div>

            <div className="relative space-y-2">
              <Label className={textColor}>{userRole === 'RIDER' ? 'Partner (Skier/Snowboarder)' : 'Rider'}</Label>
              <Input
                placeholder={`Search ${userRole === 'RIDER' ? 'partner' : 'rider'}...`}
                value={team.partnerName}
                onChange={(e) => {
                  updateTeam(team.id, 'partnerName', e.target.value);
                  setSearchQuery({ query: e.target.value, teamId: team.id });
                }}
                className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors`}
              />
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

            {userRole === 'RIDER' && (
              <div className="space-y-2">
                <Label className={textColor}>Horse</Label>
                <Select value={team.horseName} onValueChange={(v) => updateTeam(team.id, 'horseName', v)}>
                  <SelectTrigger className={`${inputBg} ${borderColor} ${textColor} data-placeholder:${textColor} ${focusRing} ${hoverBorderColor} transition-colors cursor-pointer`}>
                    <SelectValue placeholder="Select Horse" />
                  </SelectTrigger>
                  <SelectContent className={`${isLightMode ? 'bg-white border-black/20 text-black' : 'bg-black border-white/20 text-white'}`}>
                    {horses.filter(h => h.name).map((horse) => (
                      <SelectItem key={horse.id} value={horse.name} className={`focus:${isLightMode ? 'bg-black/10 text-black' : 'bg-white/10 text-white'} cursor-pointer`}>
                        {horse.name}
                      </SelectItem>
                    ))}
                    {horses.every(h => !h.name) && (
                      <div className={`p-2 text-sm ${isLightMode ? 'text-black/50' : 'text-white/50'}`}>Add horses above first</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="md:col-span-2 space-y-2">
              <Label className={textColor}>Team Name</Label>
              <Input
                placeholder="Enter team name"
                value={team.teamName}
                onChange={(e) => updateTeam(team.id, 'teamName', e.target.value)}
                className={`${inputBg} ${borderColor} ${textColor} ${placeholderColor} ${focusBorder} ${focusRing} ${hoverBorderColor} transition-colors`}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4 pt-4">
        <Button 
          onClick={addTeam} 
          variant="outline" 
          disabled={teams.length >= 4}
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