"use client";

import { createContext, useContext } from "react";
import { dateFormat } from "@/constants/date";
import { format } from "date-fns";
import useSWR from "swr";

import { apiUrls } from "@/lib/api-urls";

import { useDate } from "./datepicker-provider";

const OverviewContext = createContext(null);

interface Data {
  sales: Array<any>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const OverviewContextProvider = (props: any) => {
  const { date } = useDate();
  const from = format(date.from || date.to, dateFormat);
  const to = format(date.to || date.from, dateFormat);
  const { children, ...others } = props;

  const {
    data: salesData = [],
    isLoading: isSalesLoading,
    error: error,
  } = useSWR(apiUrls.invoice.getInvoice({ from, to }), fetcher);

  const { data: dailyData = [], isLoading: isDailyLoading } = useSWR(
    apiUrls.invoice.getInvoiceDaily({ from, to }),
    fetcher,
  );

  const data = {
    sales: salesData?.data || { count: 0, totalSales: 0, totalProfit: 0 },
    daily: dailyData?.data || [],
  };

  const loading = isSalesLoading;

  return (
    <OverviewContext.Provider value={{ data, loading }} {...others}>
      {children}
    </OverviewContext.Provider>
  );
};

export const useOverview = () => {
  const context = useContext<any>(OverviewContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a OverviewContext.`);
  }
  return context;
};
