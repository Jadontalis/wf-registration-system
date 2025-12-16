import { cn } from '../lib/utils';
import React from 'react'
import Image from 'next/image';

type EventCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<EventCoverVariant, string> = 
{
  extraSmall: 'event-cover_extra_small',
  small: 'event-cover_small',
  medium: 'event-cover_medium',
  regular: 'event-cover_regular',
  wide: 'event-cover_wide',
}

interface Props 
{
  className?: string
  variant?: EventCoverVariant;
  coverUrl: string
}

const EventCover = ({ className, variant = 'regular', coverUrl = 'https://placehold.co/400x600.png' }: Props) => 
{
  return (
    <div className = {cn('relative transition-all duration-300', variantStyles[variant], className,)}>
      EVENT SIDE SVG

      <div className="absolute z-10" style={{ left: "12%", width: "87.5%", height: "88%" }}>
        <Image 
          src={coverUrl} 
          alt="Event Cover" 
          fill 
          className="rounded-sm object-fill" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
};

export default EventCover