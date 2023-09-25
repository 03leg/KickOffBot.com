import type React from 'react'

export interface ToolBoxGroup {
  title: string;
  items: ToolBoxItem[];
}

export interface ToolBoxItem{
    title: string;
    icon: React.ReactNode;
}