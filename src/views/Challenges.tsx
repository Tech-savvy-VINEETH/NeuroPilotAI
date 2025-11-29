import React, { useEffect } from 'react';
import {
    Trophy,
    Flame,
    Target,
    Gift,
    Zap,
    Award,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { StreakChart } from '../components/Challenges/StreakChart';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function Challenges() {
    const { state, dispatch } = useApp();
    const { challenges, rewards, streak, totalCompleted } = state;

    // Fetch challenges and rewards on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Challenges
                const challengesRes = await fetch('http://localhost:3000/challenges');
                if (challengesRes.ok) {
                    const data = await challengesRes.json();
                    if (data.status === 'success') {
                        dispatch({ type: 'SET_CHALLENGES', payload: data.challenges });
                    }
                }

                // Fetch Rewards
                const rewardsRes = await fetch('http://localhost:3000/rewards');
                if (rewardsRes.ok) {
                    const data = await rewardsRes.json();
                    if (data.status === 'success') {
                        dispatch({ type: 'SET_REWARDS', payload: data.rewards });
                    }
                }

                // Fetch User Stats
                const statsRes = await fetch('http://localhost:3000/user/stats');
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    if (data.status === 'success') {
                        dispatch({ type: 'UPDATE_USER_STATS', payload: data.stats });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch gamification data:', error);
            }
        };

        fetchData();
    }, [dispatch]);

    // Calculate level based on total completed tasks
    const level = Math.floor(totalCompleted / 10) + 1;
    const progressToNextLevel = (totalCompleted % 10) * 10; // 10 tasks per level

    // Calculate total points available (from backend stats or local fallback)
    const totalPoints = state.productivityScore * 10; // Simplified for now, should come from backend

    const handleRedeem = async (rewardId: string, cost: number) => {
        if (totalPoints >= cost) {
            try {
                const response = await fetch('http://localhost:3000/rewards/redeem', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rewardId })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success') {
                        dispatch({ type: 'REDEEM_REWARD', payload: rewardId });
                        // Update local stats if returned
                        if (data.userStats) {
                            dispatch({ type: 'UPDATE_USER_STATS', payload: data.userStats });
                        }
                    } else {
                        alert(data.error || 'Failed to redeem reward');
                    }
                }
            } catch (error) {
                console.error('Redemption failed:', error);
                alert('Failed to connect to server');
            }
        } else {
            alert('Not enough points!');
        }
    };

    return (
        <div className="max-w-7xl mx-auto h-full overflow-y-auto space-y-8 animate-fade-in pb-8">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-[var(--text-primary)]">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        Challenges & Rewards
                    </h1>
                    <p className="mt-1 text-[var(--text-secondary)]">
                        Complete challenges, maintain your streak, and earn rewards.
                    </p>
                </div>

                <Card className="flex items-center gap-4 px-6 py-3 bg-[var(--bg-secondary)]/50 backdrop-blur-md border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <Award className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <div className="text-xs font-medium uppercase tracking-wider text-yellow-500">Level {level}</div>
                            <div className="text-sm font-bold text-[var(--text-primary)]">{totalCompleted} Tasks Completed</div>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-[var(--border-color)] mx-2" />
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <div className="text-xs font-medium uppercase tracking-wider text-orange-500">Streak</div>
                            <div className="text-sm font-bold text-[var(--text-primary)]">{streak} Days</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Level Progress */}
            <Card className="p-6 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[var(--text-primary)]">Progress to Level {level + 1}</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{progressToNextLevel}%</span>
                </div>
                <div className="h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNextLevel}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
                <p className="text-xs mt-2 text-[var(--text-secondary)]">
                    Complete {10 - (totalCompleted % 10)} more tasks to level up!
                </p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Challenges & Streak */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Streak History */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Activity History
                        </h2>
                        <Card className="p-6 h-72 bg-[var(--bg-secondary)]/30 border-[var(--border-color)]">
                            <StreakChart />
                        </Card>
                    </section>

                    {/* Active Challenges */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                            <Target className="w-5 h-5 text-blue-500" />
                            Active Challenges
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {challenges.map((challenge, index) => (
                                <motion.div
                                    key={challenge.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={cn(
                                        "p-5 transition-all duration-300 hover:shadow-lg border-[var(--border-color)]",
                                        challenge.status === 'completed'
                                            ? "bg-green-900/10 border-green-500/30"
                                            : "bg-[var(--bg-secondary)]/50"
                                    )}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={cn(
                                                "px-2 py-1 rounded text-xs font-medium uppercase tracking-wider",
                                                challenge.type === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                                                    challenge.type === 'weekly' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                            )}>
                                                {challenge.type}
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                                <Zap className="w-4 h-4" />
                                                {challenge.reward} pts
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-lg mb-1 text-[var(--text-primary)]">{challenge.title}</h3>
                                        <p className="text-sm mb-4 text-[var(--text-secondary)]">{challenge.description}</p>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                                                <span>Progress</span>
                                                <span>{challenge.progress} / {challenge.target}</span>
                                            </div>
                                            <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                                <motion.div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        challenge.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                                    )}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                                                    transition={{ duration: 1 }}
                                                />
                                            </div>
                                        </div>

                                        {challenge.status === 'completed' && (
                                            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-medium animate-pulse">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Challenge Completed!
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Rewards */}
                <div className="lg:col-span-1">
                    <section className="sticky top-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
                                <Gift className="w-5 h-5 text-purple-500" />
                                Rewards Shop
                            </h2>
                            <div className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30 shadow-sm">
                                {totalPoints} pts Available
                            </div>
                        </div>

                        <div className="space-y-4">
                            {rewards.map((reward, index) => (
                                <motion.div
                                    key={reward.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="p-4 bg-[var(--bg-secondary)]/50 border-[var(--border-color)] group hover:border-purple-500/50 transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "p-3 rounded-lg transition-colors",
                                                reward.isRedeemed ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' : 'bg-purple-500/20 text-purple-400'
                                            )}>
                                                <Gift className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[var(--text-primary)]">{reward.title}</h3>
                                                <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1 font-medium">
                                                    <Zap className="w-3 h-3" />
                                                    {reward.cost} points
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleRedeem(reward.id, reward.cost)}
                                            disabled={reward.isRedeemed || totalPoints < reward.cost}
                                            className={cn(
                                                "w-full mt-4 font-bold shadow-none",
                                                reward.isRedeemed
                                                    ? "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] cursor-not-allowed hover:bg-[var(--bg-tertiary)]"
                                                    : totalPoints >= reward.cost
                                                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20"
                                                        : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] cursor-not-allowed hover:bg-[var(--bg-tertiary)]"
                                            )}
                                        >
                                            {reward.isRedeemed ? 'Redeemed' : 'Redeem Reward'}
                                        </Button>

                                        {reward.isRedeemed && reward.code && (
                                            <div className="mt-3 p-2 bg-black/30 rounded border border-dashed border-gray-600 text-center">
                                                <span className="text-xs text-gray-400 block mb-1">Your Code:</span>
                                                <code className="font-mono text-green-400 font-bold tracking-wider">{reward.code}</code>
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}
