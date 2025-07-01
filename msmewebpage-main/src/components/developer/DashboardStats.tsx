import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
          <CardDescription>Your uploaded repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">8</p>
          <p className="text-muted-foreground">Active Projects</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Downloads</CardTitle>
          <CardDescription>Total project downloads</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">256</p>
          <p className="text-muted-foreground">Total Downloads</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Total earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$1,250</p>
          <p className="text-muted-foreground">Total Revenue</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;