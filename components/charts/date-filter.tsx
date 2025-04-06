"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dateFormat } from "@/constants/date"
import { Card } from "@/components/ui/card"

export function DateFilter() {
  const [dateRange, setDateRange] = useState<"year" | "month" | "custom">("year")
  const [fromDate, setFromDate] = useState<Date | undefined>(startOfYear(new Date()))
  const [toDate, setToDate] = useState<Date | undefined>(endOfYear(new Date()))
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTabChange = (value: string) => {
    let newFrom: Date
    let newTo: Date

    if (value === "year") {
      newFrom = startOfYear(new Date())
      newTo = endOfYear(new Date())
    } else if (value === "month") {
      newFrom = startOfMonth(new Date())
      newTo = endOfMonth(new Date())
    } else {
      // Keep current custom dates if switching to custom
      newFrom = fromDate || startOfYear(new Date())
      newTo = toDate || endOfYear(new Date())
    }

    setFromDate(newFrom)
    setToDate(newTo)
    setDateRange(value as "year" | "month" | "custom")
  }

  if (!mounted) {
    return null
  }

  return (
    <Card className="w-full border-0 bg-background/50 shadow-sm backdrop-blur-sm">
      <form action="/dashboard/charts" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Tabs value={dateRange} onValueChange={handleTabChange} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-2 rounded-lg bg-muted/80 p-1">
              <TabsTrigger
                value="year"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Current Year
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Current Month
              </TabsTrigger>
              {/* <TabsTrigger
                value="custom"
                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Custom
              </TabsTrigger> */}
            </TabsList>
          </Tabs>
          <Button type="submit" className="w-full sm:w-auto">
                Apply Filter
              </Button>
{/* 
          <input type="hidden" name="from" value={fromDate ? format(fromDate, dateFormat) : ""} />
          <input type="hidden" name="to" value={toDate ? format(toDate, dateFormat) : ""} />

          {dateRange === "custom" && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="from-date" className="text-sm font-medium text-muted-foreground">
                    From
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="from-date"
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="to-date" className="text-sm font-medium text-muted-foreground">
                    To
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="to-date"
                        type="button"
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button type="submit" className="mt-2 w-full sm:mt-0 sm:w-auto">
                Apply Filter
              </Button>
            </div>
          )} */}

          {/* {dateRange !== "custom" && (
            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                Apply Filter
              </Button>
            </div>
          )} */}
        </div>
      </form>
    </Card>
  )
}

