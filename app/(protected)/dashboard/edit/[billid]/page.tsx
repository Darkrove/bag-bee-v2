import React from 'react'

import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";

interface Props {
    params: {
        billid: string
    }
}

export const metadata = constructMetadata({
  title: "Edit Invoice | Famous Bag",
  description: "Edit invoice.",
});

const page = ({ params: { billid } }: Props) => {
  return (
   <>
   <DashboardHeader heading={`Edit ${billid}`} text="Edit invoice." />
   
   </>
  )
}

export default page