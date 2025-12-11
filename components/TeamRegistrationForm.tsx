'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchCompetitors } from '@/lib/actions/user';
import { submitRegistrationCart } from '@/lib/actions/registration';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface TeamRegistrationFormProps {
  userId: string;
  userRole: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'BOTH';
}

interface Team {
  id: number;
  partnerId: string;
  partnerName: string;
  horseName: string;
}

const TeamRegistrationForm = ({ userId, userRole }: TeamRegistrationFormProps) => {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([{ id: 1, partnerId: '', partnerName: '', horseName: '' }]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchingForTeamId, setSearchingForTeamId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addTeam = () => {
    if (teams.length >= 4) {
      toast.error('Maximum 4 teams allowed');
      return;
    }
    setTeams([...teams, { id: Date.now(), partnerId: '', partnerName: '', horseName: '' }]);
  };

  const removeTeam = (id: number) => {
    setTeams(teams.filter((t) => t.id !== id));
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
    // If I am a RIDER, I look for SKIER (which now means any non-rider).
    // If I am not a RIDER, I look for RIDER.
    const targetType = userRole === 'RIDER' ? 'SKIER' : 'RIDER';
    const results = await searchCompetitors(query, targetType, userId);
    setSearchResults(results);
  };

  const selectPartner = (teamId: number, partner: any) => {
    updateTeam(teamId, 'partnerId', partner.id);
    updateTeam(teamId, 'partnerName', partner.fullName);
    setSearchingForTeamId(null);
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    // Validate
    for (const team of teams) {
      if (!team.partnerId || !team.horseName) {
        toast.error('Please complete all team details');
        return;
      }
    }

    setSubmitting(true);
    try {
      const formattedTeams = teams.map((t) => ({
        riderId: userRole === 'RIDER' ? userId : t.partnerId,
        skierId: userRole !== 'RIDER' ? userId : t.partnerId,
        horseName: t.horseName,
      }));

      const result = await submitRegistrationCart(userId, formattedTeams);
      if (result.success) {
        toast.success('Registration submitted successfully!');
        router.push('/account-settings'); // Or success page
      } else {
        toast.error(result.error || 'Submission failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {teams.map((team, index) => (
        <div key={team.id} className="p-6 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm space-y-4 relative">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-xl">Team {index + 1}</h3>
            {teams.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeTeam(team.id)} className="hover:bg-white/10 text-red-400 hover:text-red-300">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">You ({userRole})</Label>
              <Input 
                disabled 
                value="Me" 
                className="bg-white/10 border-white/20 text-white/70 cursor-not-allowed" 
              />
            </div>

            <div className="relative space-y-2">
              <Label className="text-white">{userRole === 'RIDER' ? 'Partner (Skier/Snowboarder)' : 'Rider'}</Label>
              <Input
                placeholder={`Search ${userRole === 'RIDER' ? 'partner' : 'rider'}...`}
                value={team.partnerName}
                onChange={(e) => {
                  updateTeam(team.id, 'partnerName', e.target.value);
                  handleSearch(e.target.value, team.id);
                }}
                className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
              />
              {searchingForTeamId === team.id && searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-zinc-900 border border-white/20 rounded-md shadow-xl mt-1 max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 hover:bg-white/10 cursor-pointer text-white transition-colors"
                      onClick={() => selectPartner(team.id, user)}
                    >
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-xs text-white/50">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-white">Horse Name</Label>
              <Input
                placeholder="Enter horse name"
                value={team.horseName}
                onChange={(e) => updateTeam(team.id, 'horseName', e.target.value)}
                className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
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
          className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
        >
          Add Another Team
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={submitting} 
          className="flex-1 bg-white text-black hover:bg-gray-200 font-semibold cursor-pointer"
        >
          {submitting ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </div>
    </div>
  );
};

export default TeamRegistrationForm;
