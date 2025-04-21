"use client";

import { useState } from "react";

import {
  Users,
  Scissors,
  UserRound,
  Calendar,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSidebar } from "../components/sidebar-provider";
import { cn } from "@/lib/utils";
import { Header } from "../components/haeder";
import { Sidebar } from "../components/sidebar";
import { StatCard } from "../components/stat-card";
import { VisitorsChart } from "../components/visitor-chart";
import { RevenueChart } from "../components/revenue-chart";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300 px-2"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Clients"
              value="22"
              percentage={75}
              color="green"
              icon={<Users className="h-5 w-5 text-white" />}
            />
            <StatCard
              title="Total Services"
              value="12"
              percentage={60}
              color="amber"
              icon={<Scissors className="h-5 w-5 text-white" />}
            />
            <StatCard
              title="Total Employees"
              value="05"
              percentage={45}
              color="blue"
              icon={<UserRound className="h-5 w-5 text-white" />}
            />
            <StatCard
              title="Total Clients"
              value="03"
              percentage={35}
              color="red"
              icon={<Calendar className="h-5 w-5 text-white" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Total Visitors</h2>
                <Button variant="outline" size="sm" className="h-8">
                  {selectedMonth} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <VisitorsChart />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Revenue</h2>
                <Button variant="outline" size="sm" className="h-8">
                  {selectedMonth} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">+82%</div>
                  <div className="text-sm text-gray-500">
                    Created for premium quality.
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <RevenueChart />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">
                      Upcoming Bookings
                    </TabsTrigger>
                    <TabsTrigger value="all">All Bookings</TabsTrigger>
                    <TabsTrigger value="canceled">
                      Canceled Bookings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Service
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
