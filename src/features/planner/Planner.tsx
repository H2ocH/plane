import React, { useState } from 'react';
import { PlannerOptions } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';


interface PlannerProps {
    onPlanGenerated: (options: PlannerOptions) => void;
    isGenerating: boolean;
}

const interestsList = ['History', 'Art & Culture', 'Foodie', 'Adventure', 'Nature', 'Shopping', 'Nightlife', 'Relaxation'];

const Planner: React.FC<PlannerProps> = ({ onPlanGenerated, isGenerating }) => {
    const [destination, setDestination] = useState('Tokyo, Japan');
    const [duration, setDuration] = useState(7);
    const [budget, setBudget] = useState<'Budget-Friendly' | 'Mid-Range' | 'Luxury'>('Mid-Range');
    const [interests, setInterests] = useState<string[]>(['Foodie', 'History']);
    const { toast } = useToast();

    const handleInterestChange = (interest: string) => {
        setInterests(prev => 
            prev.includes(interest) 
            ? prev.filter(i => i !== interest)
            : [...prev, interest]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!destination.trim() || interests.length === 0) {
            toast({
              variant: "destructive",
              title: "Incomplete Form",
              description: "Please fill out the destination and select at least one interest.",
            });
            return;
        }
        onPlanGenerated({ destination, duration, budget, interests });
    };

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>Plan Your Next Trip</CardTitle>
                <CardDescription>Fill in the details below to generate a personalized itinerary.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input id="destination" placeholder="e.g., Paris, France" value={destination} onChange={e => setDestination(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (days)</Label>
                        <Input id="duration" type="number" min="1" max="30" value={duration} onChange={e => setDuration(parseInt(e.target.value, 10))} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="budget">Budget</Label>
                        <Select onValueChange={(value: any) => setBudget(value)} defaultValue={budget}>
                            <SelectTrigger id="budget">
                                <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Budget-Friendly">Budget-Friendly</SelectItem>
                                <SelectItem value="Mid-Range">Mid-Range</SelectItem>
                                <SelectItem value="Luxury">Luxury</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Interests</Label>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            {interestsList.map(interest => (
                                <div key={interest} className="flex items-center space-x-2">
                                    <Checkbox id={interest} checked={interests.includes(interest)} onCheckedChange={() => handleInterestChange(interest)} />
                                    <Label htmlFor={interest} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {interest}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate Plan'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default Planner;
