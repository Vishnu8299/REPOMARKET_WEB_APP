import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  BarChart,
  Activity,
  TrendingUp,
  Users,
  Code,
  Star,
  GitPullRequest,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for analytics
const analyticsData = {
  overview: {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    totalContributions: 156
  },
  projectMetrics: {
    codeQuality: 92,
    testCoverage: 87,
    performance: 95,
    security: 89
  },
  recentActivity: [
    {
      id: 1,
      type: "commit",
      project: "E-commerce Platform",
      message: "Updated user authentication flow",
      time: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      type: "pull-request",
      project: "Analytics Dashboard",
      message: "Added new visualization components",
      time: "5 hours ago",
      status: "pending"
    },
    {
      id: 3,
      type: "issue",
      project: "Mobile App",
      message: "Fixed navigation bug",
      time: "1 day ago",
      status: "success"
    }
  ],
  performanceData: {
    commits: [45, 52, 38, 65, 42, 58, 48],
    pullRequests: [12, 15, 8, 10, 14, 9, 11],
    codeReviews: [18, 22, 15, 20, 25, 19, 23]
  },
  projectHealth: [
    { name: "E-commerce Platform", health: 95, status: "healthy" },
    { name: "Analytics Dashboard", health: 88, status: "attention" },
    { name: "Mobile App", health: 92, status: "healthy" }
  ],
  timeDistribution: {
    coding: 45,
    meetings: 15,
    review: 25,
    planning: 15
  }
};

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const MetricCard = ({ title, value, icon: Icon, trend, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            {trend}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ item }: any) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center space-x-3">
        {item.type === "commit" && <Code className="w-4 h-4 text-blue-500" />}
        {item.type === "pull-request" && <GitPullRequest className="w-4 h-4 text-purple-500" />}
        {item.type === "issue" && <AlertCircle className="w-4 h-4 text-orange-500" />}
        <div>
          <p className="text-sm font-medium">{item.project}</p>
          <p className="text-xs text-gray-500">{item.message}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={item.status === "success" ? "default" : "secondary"}>
          {item.status}
        </Badge>
        <span className="text-xs text-gray-500">{item.time}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your development metrics and project performance
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Projects"
                  value={analyticsData.overview.totalProjects}
                  icon={Code}
                  trend="+2 from last month"
                />
                <MetricCard
                  title="Active Projects"
                  value={analyticsData.overview.activeProjects}
                  icon={Activity}
                  description="Currently in development"
                />
                <MetricCard
                  title="Completed Projects"
                  value={analyticsData.overview.completedProjects}
                  icon={CheckCircle2}
                  trend="+3 this quarter"
                />
                <MetricCard
                  title="Total Contributions"
                  value={analyticsData.overview.totalContributions}
                  icon={Users}
                  trend="+12% increase"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-8">
                {/* Project Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Metrics</CardTitle>
                    <CardDescription>Overall quality indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(analyticsData.projectMetrics).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm text-gray-500">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and changes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatePresence>
                      {analyticsData.recentActivity.map((item) => (
                        <ActivityItem key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Time Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Time Distribution</CardTitle>
                    <CardDescription>How you spend your development time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analyticsData.timeDistribution).map(([activity, percentage]) => (
                        <div key={activity} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{activity}</span>
                            <span className="text-sm text-gray-500">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Health */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Health</CardTitle>
                    <CardDescription>Status of your active projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.projectHealth.map((project) => (
                        <div key={project.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{project.name}</span>
                            <Badge variant={project.status === "healthy" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                          <Progress 
                            value={project.health} 
                            className="h-2"
                            indicatorClassName={
                              project.health >= 90 ? "bg-green-500" :
                              project.health >= 80 ? "bg-yellow-500" : "bg-red-500"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid gap-6 md:grid-cols-3">
                {analyticsData.projectHealth.map((project) => (
                  <Card key={project.name}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>Project health and metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Health Score</span>
                          <span className="text-sm text-gray-500">{project.health}%</span>
                        </div>
                        <Progress 
                          value={project.health} 
                          className="h-2"
                          indicatorClassName={
                            project.health >= 90 ? "bg-green-500" :
                            project.health >= 80 ? "bg-yellow-500" : "bg-red-500"
                          }
                        />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium">Commits</div>
                            <div className="text-2xl font-bold text-blue-600">24</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium">PRs</div>
                            <div className="text-2xl font-bold text-purple-600">8</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Analytics; 