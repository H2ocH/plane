import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const SkeletonLoader: React.FC = () => {
    const SkeletonBox = ({className = ""}: {className?: string}) => <div className={`h-4 bg-muted rounded animate-pulse ${className}`}></div>;

    return (
        <Card className="shadow-lg h-full">
            <CardHeader>
                <SkeletonBox className="h-7 w-3/4" />
                <SkeletonBox className="w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card><CardHeader><SkeletonBox /></CardHeader><CardContent className="space-y-2"><SkeletonBox /><SkeletonBox className="w-5/6" /></CardContent></Card>
                    <Card><CardHeader><SkeletonBox /></CardHeader><CardContent className="space-y-2"><SkeletonBox /><SkeletonBox className="w-5/6" /></CardContent></Card>
                </div>

                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <SkeletonBox className="h-6 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><SkeletonBox /><SkeletonBox className="w-5/6" /></div>
                            <div className="space-y-2"><SkeletonBox /><SkeletonBox className="w-5/6" /></div>
                            <div className="space-y-2"><SkeletonBox /><SkeletonBox className="w-5/6" /></div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};

export default SkeletonLoader;
