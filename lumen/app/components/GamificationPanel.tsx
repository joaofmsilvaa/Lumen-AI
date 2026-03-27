import { Trophy, Star, BookOpen, MessageCircle, Award } from 'lucide-react';

interface GamificationPanelProps {
  points: number;
}

export default function GamificationPanel({ points }: GamificationPanelProps) {
  const badges = [
    {
      id: 'first-upload',
      name: 'First Upload',
      description: 'Upload your first document',
      icon: BookOpen,
      threshold: 10,
      unlocked: points >= 10
    },
    {
      id: 'knowledge-builder',
      name: 'Knowledge Builder',
      description: 'Build your first knowledge base',
      icon: Star,
      threshold: 30,
      unlocked: points >= 30
    },
    {
      id: 'curious-mind',
      name: 'Curious Mind',
      description: 'Ask 5 questions',
      icon: MessageCircle,
      threshold: 35,
      unlocked: points >= 35
    },
    {
      id: 'scholar',
      name: 'Scholar',
      description: 'Reach 100 points',
      icon: Award,
      threshold: 100,
      unlocked: points >= 100
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
      <div className="flex items-center space-x-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
      </div>

      {/* Points Display */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-indigo-600">{points}</div>
        <div className="text-sm text-gray-600">Total Points</div>
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Badges Earned</h4>
        {badges.map(badge => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`flex items-center space-x-3 p-3 rounded-md ${
                badge.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`p-2 rounded-full ${
                badge.unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  badge.unlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {badge.name}
                </div>
                <div className="text-xs text-gray-600">{badge.description}</div>
                {!badge.unlocked && (
                  <div className="text-xs text-gray-500 mt-1">
                    {points}/{badge.threshold} points
                  </div>
                )}
              </div>
              {badge.unlocked && (
                <Trophy className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress to Next Badge */}
      {badges.some(b => !b.unlocked) && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Next Achievement</h4>
          {(() => {
            const nextBadge = badges.find(b => !b.unlocked);
            if (nextBadge) {
              const progress = Math.min((points / nextBadge.threshold) * 100, 100);
              return (
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{nextBadge.name}</span>
                    <span>{points}/{nextBadge.threshold}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Motivational Message */}
      <div className="mt-6 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
        <p className="text-xs text-indigo-800">
          Keep learning! Each question brings you closer to mastering your subjects.
        </p>
      </div>
    </div>
  );
}