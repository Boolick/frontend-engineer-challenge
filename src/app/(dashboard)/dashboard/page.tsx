'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/ui/button';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

export default function DashboardPage() {
  const { logout, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="h-16 border-b bg-background flex items-center justify-between px-8">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <LayoutDashboard className="w-6 h-6" />
          Orbitto
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout} 
          isLoading={isLoading}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </header>
      
      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-background rounded-xl border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Profile Status</h3>
                <p className="text-sm text-muted-foreground">Authenticated via BFF</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4" />
              </div>
              <p className="text-xs text-muted-foreground text-right">75% Complete</p>
            </div>
          </div>
          
          {/* Placeholder cards */}
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-background rounded-xl border shadow-sm opacity-50">
              <div className="h-6 w-32 bg-muted rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
