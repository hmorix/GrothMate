import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { WeeklyMission } from '../types';
import { Flame, Award, CheckCircle2, Trophy, Clock, Camera, Sparkles, Sprout } from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const MissionsPage: React.FC = () => {
  const { missions, badges, profile, completeMission } = useGarden();

  const [activeProofMission, setActiveProofMission] = useState<WeeklyMission | null>(null);
  const [proofNote, setProofNote] = useState('');

  const completedCount = missions.filter(m => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / missions.length) * 100);

  const handleCompleteWithProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProofMission) return;

    completeMission(activeProofMission.id, proofNote.trim() || 'Completed outdoors with living plants.');
    setActiveProofMission(null);
    setProofNote('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-earth-800 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-xs uppercase tracking-wider">
              Hacktoberfest Week 1
            </span>
            <span className="text-amber-200 text-xs font-semibold">Touch Grass Challenge</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
            Real-World Gardening Missions
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Close your laptop, walk outside, and touch the soil. Complete outdoor nature rituals to earn experience points and maintain your daily outdoor streak.
          </p>
        </div>

        {/* Streak & XP Card */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center min-w-[200px] space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-amber-300">
            <Flame className="w-6 h-6 fill-amber-400" />
            <span className="text-2xl font-black font-display">{profile.streakDays} Days</span>
          </div>
          <p className="text-xs text-amber-200 font-semibold">Touch Grass Streak</p>
          <div className="pt-2 text-[11px] text-amber-100 border-t border-white/10">
            Total XP: <strong>{profile.totalXp} pts</strong>
          </div>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700">Weekly Outdoor Progress: {completedCount} of {missions.length} Missions Accomplished</span>
          <span className="text-nature-700 font-bold">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-nature-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-nature-600" />
          <span>Active Real-World Missions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map(mission => (
            <div
              key={mission.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                mission.isCompleted
                  ? 'bg-nature-50/50 border-nature-200/80 text-nature-950'
                  : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{mission.icon}</span>
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">{mission.title}</h3>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 capitalize">
                        {mission.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    mission.isCompleted 
                      ? 'bg-nature-200 text-nature-900' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    +{mission.xpPoints} XP
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {mission.description}
                </p>

                {mission.proofNote && (
                  <p className="text-[11px] text-nature-800 bg-nature-100/60 p-2 rounded-xl mt-3 italic border border-nature-200/60">
                    "{mission.proofNote}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end border-t border-slate-100">
                {mission.isCompleted ? (
                  <span className="text-xs font-bold text-nature-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-nature-600" />
                    <span>Completed Outdoors!</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveProofMission(mission)}
                    className="px-4 py-2 rounded-xl bg-nature-600 hover:bg-nature-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Mission</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges Trophy Case */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Achievement Badges Trophy Case</span>
          </h2>
          <span className="text-xs text-slate-500">
            {badges.filter(b => b.isUnlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                badge.isUnlocked
                  ? 'bg-amber-50/50 border-amber-200/80 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <span className="text-3xl block">{badge.icon}</span>
              <div>
                <h4 className="font-display font-bold text-xs text-slate-900">{badge.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{badge.description}</p>
              </div>
              {badge.isUnlocked && (
                <span className="inline-block text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mission Completion Modal */}
      {activeProofMission && (
        <Modal
          isOpen={!!activeProofMission}
          onClose={() => setActiveProofMission(null)}
          title={`Log Completion: ${activeProofMission.title}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCompleteWithProof} className="space-y-4">
            <p className="text-xs text-slate-600">
              {activeProofMission.description}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Real-World Observation Note (What did you experience outdoors?)
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Spent 5 minutes looking at the basil leaves. Found ladybug nymphs on the underside!"
                value={proofNote}
                onChange={e => setProofNote(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveProofMission(null)}
                className="px-4 py-2 text-xs rounded-xl border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-nature-600 hover:bg-nature-700 text-white shadow-xs"
              >
                Claim +{activeProofMission.xpPoints} XP & Streak
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
