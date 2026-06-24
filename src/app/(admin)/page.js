"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Star,
  Clock,
  ArrowRight,
  BarChart3,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function DashboardPage() {
  return (
    <div className="min-h-svh space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-none shadow-lg shadow-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹0</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-green-400">0%</span>
                <span>vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg shadow-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹0</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-green-400">0%</span>
                <span>vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg shadow-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹0</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-green-400">0%</span>
                <span>this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg shadow-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span>Based on reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart & Top Services */}
        <div className="grid gap-4 lg:grid-cols-7">
          {/* Revenue Chart */}
          <Card className="lg:col-span-4 bg-white border-none shadow-lg shadow-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Revenue Overview</CardTitle>
                  <CardDescription className="text-muted-foreground">Daily revenue for the last 7 days</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <BarChart3 className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-revenue)", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Services */}
          <Card className="lg:col-span-3 bg-white border-none shadow-lg shadow-gray-200">
            <CardHeader>
              <CardTitle className="text-foreground">Top Services</CardTitle>
              <CardDescription className="text-muted-foreground">Most booked services this month</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className="space-y-4">
                  [].map((service, index) => (
                    <div key={service.id} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {service.bookings} bookings · {service.duration}min · {formatCurrency(service.price)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        {service.category}
                      </Badge>
                    </div>
                  ))
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Appointments & Staff Performance */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Upcoming Appointments */}
          <Card className="bg-white border-none shadow-lg shadow-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Upcoming Appointments</CardTitle>
                  <CardDescription className="text-muted-foreground">Next 5 scheduled appointments</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 text-primary">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  {/* [].map((apt, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {apt.client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{apt.client.name}</p>
                          <Badge className={getStatusColor(apt.status)} variant="outline">
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{apt.service.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(apt.appointment_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(apt.appointment_date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {apt.staff.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(apt.total_amount)}</p>
                      </div>
                    </div>
                  )) */}
              </div>
            </CardContent>
          </Card>

          {/* Staff Performance */}
          <Card className="bg-white border-none shadow-lg shadow-gray-200">
            <CardHeader>
              <CardTitle className="text-foreground">Staff Performance</CardTitle>
              <CardDescription className="text-muted-foreground">Top performing team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  {/* [].map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">John Doe</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(0)}</p>
                        <p className="text-xs text-muted-foreground">0 appointments</p>
                      </div>
                    </div>
                  )) */}
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
