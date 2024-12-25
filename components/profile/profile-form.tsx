"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormProps {
  user: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ProfileForm({ user, onSave, onCancel }: ProfileFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    onSave(data);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Ονοματεπώνυμο</Label>
            <Input 
              id="full_name" 
              name="full_name" 
              defaultValue={user?.full_name} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Τηλέφωνο</Label>
            <Input 
              id="phone_number" 
              name="phone_number" 
              defaultValue={user?.phone_number} 
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Θέση</Label>
            <Select name="position" defaultValue={user?.position || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε θέση" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goalkeeper">Τερματοφύλακας</SelectItem>
                <SelectItem value="defender">Αμυντικός</SelectItem>
                <SelectItem value="midfielder">Μέσος</SelectItem>
                <SelectItem value="forward">Επιθετικός</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="self_rating">Αυτοαξιολόγηση (1-10)</Label>
            <Input 
              id="self_rating" 
              name="self_rating" 
              type="number" 
              min="1" 
              max="10" 
              step="0.5"
              defaultValue={user?.self_rating || "5"} 
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Ακύρωση
          </Button>
          <Button type="submit">
            Αποθήκευση
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 