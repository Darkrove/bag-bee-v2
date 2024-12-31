"use client";

import { useState, useTransition } from "react";
import { User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserMailBoxProps {
  user: Pick<User, "id" | "email">;
}

export function UserMailBox({ user }: UserMailBoxProps) {
  return (
    <SectionColumns
      title="Mail Box"
      description="Your email address is used for login and notifications."
    >
      <div className="flex w-full items-center gap-2">
          <Input
            id="email"
            type="email"
            defaultValue={user.email ?? ""}
            className="w-full"
            readOnly
            disabled
          />
        </div>
    </SectionColumns>
  );
}