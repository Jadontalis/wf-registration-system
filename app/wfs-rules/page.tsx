"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const WaiverPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const totalScroll = scrollHeight - clientHeight
      const currentProgress = (scrollTop / totalScroll) * 100
      setScrollProgress(currentProgress)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 p-8 max-w-3xl mx-auto text-black relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-50">
        <div 
          className="h-full bg-[#000080] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="mb-[3em] mt-4">
        <Image
          src="/icons/logo-light.jpg"
          alt="Logo"
          width={120}
          height={120}
          className="h-auto w-auto"
          priority
        />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-black text-center">Whitefish Skijoring Nonprofit Association 2026 Rules & Regulations</h1>
      
      <div 
        ref={contentRef}
        onScroll={handleScroll}
        className="bg-white p-6 rounded-lg backdrop-blur-sm mb-8 max-h-[60vh] overflow-y-auto border border-white/20"
      >
        <h2 className="text-xl font-bold mb-4">COMPETITOR Whitefish Skijoring, WAIVER AND RELEASE FORM</h2>
        <p className="mb-4">
          By agreeing to this waiver and release form for the Whitefish Skijoring Event, PARTICIPANT(S) (undersigned participant(s) or undersigned parent(s) or guardian(s)) agree(s) and fully understand(s) the following:
        </p>
        <p className="mb-4">
          I have read and understand the official rules.
        </p>
        <p className="mb-4">
          I fully understand that my entry fee is non-refundable other than under the circumstances noted in the official rules.
        </p>
        <p className="mb-4">
          I fully understand that engaging in the sport of skijoring is a hazardous, dangerous and unpredictable activity, which could result in personal injury and/or death. I am voluntarily participating in this event with knowledge of the danger involved and hereby agree to accept any and all risks of injury and/or death, and I agree that I am solely responsible for any injury to myself or any other person due to my participation in this event. I agree that I am solely responsible for my own safety while participating in this event, and I am free to refuse to participate in this event for any reason.
        </p>
        <p className="mb-4">
          I hereby certify that I am physically fit and have trained to participate in this event. I agree that all decisions I make and actions I take are my own. I further agree that I will pay for any and all medical or other expenses incurred as a result of injury to myself by participating in this event, and that I will not seek indemnification from Whitefish Winter Carnival Skijoring, its Board Members, Sponsors, Land Owners, Race Directors, Volunteers, Spectators, or insurers, or from any Municipalities, the State of Montana, Flathead County, or any City, County and State Agencies, Partners, Employees, or Agents or their insurers.
        </p>
        <p className="mb-4">
          I understand that horseback riding, racing and skiing and/or snowboarding behind a horse will expose me to extreme health risks. I agree to assume and accept the risks that occur in the activity of horseback riding, skiing, snowboarding, racing and/or skiing and/or snowboarding behind a horse.
        </p>
        <p className="mb-4">
          I hereby waive and release for myself, my heirs or assigns, executors and administrators all rights or claims for damage which I may have now or in the future against the Whitefish Winter Carnival Skijoring Association, its Board Members, Sponsors, Land Owners, Race Directors, Volunteers, Spectators, or insurers, or from any Municipalities, the State of Montana, Flathead County, or any City, County and State Agencies, Partners, Employees, or Agents or their insurers from any and all claims relating to or pertaining to personal injuries, including death, or damages to property, real or personal, caused by or arising out of my involvement in this event.
        </p>
        <p className="mb-4">
          I fully understand that I am responsible for the health and safety of the horse. I waive and release all rights or claims against Whitefish Winter Carnival Skijoring Association, its Board Members, Sponsors, Land Owners, Race Directors, Volunteers, Spectators, or insurers, or from any Municipalities, the State of Montana, Flathead County, or any City, County and State Agencies, Partners, Employees, or Agents or their insurers in case of injury and/or death of the horse. I also understand I am fully responsible and personally liable for any expenses incurred if the horse is injured or for any actions the horse may take causing injury or damage to humans, livestock or property, and I agree that I will not seek indemnification for any such injuries from the Whitefish Winter Carnival Skijoring Association, its Board Members, Sponsors, Land Owners, Race Directors, Volunteers, Spectators, or insurers, or from any Municipalities, the State of Montana, Flathead County, or any City, County and State Agencies, Partners, Employees, or Agents or their insurers.
        </p>
        <p className="mb-4">
          I agree to allow Whitefish Winter Carnival Skijoring Association Officials, Race Organizers and Media representatives the use of my name, photos, video recordings, comments or commentaries to help publicize and promote Whitefish Winter Carnival Skijoring Association and the sport of Skijoring.
        </p>
        <p className="mb-4">
          Good sportsmanship is required at Whitefish Skijoring Races. I acknowledge that the Whitefish Skijoring officials may disqualify any person or team they deem is acting in an unsportsmanlike manner at any time including, but not limited to registration, Calcutta, and awards ceremonies. If I am disqualified, I understand and agree that I will surrender my entry fees as well as forfeit event and Calcutta winnings.
        </p>
      </div>

      <Link href="/create-account">
        <Button className="bg-[#000080] text-white hover:bg-[#000060] font-semibold px-8 cursor-pointer">
          Continue to Create Account
        </Button>
      </Link>

      <footer className="w-full py-8 px-6 mt-auto">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-black text-xs md:text-sm">
            © {new Date().getFullYear()} Whitefish Skijoring Nonprofit Association
          </p>
          <p className="text-black/70 text-[10px] md:text-xs">
            Built by Jaybird Web Design & Development, LLC
          </p>
        </div>
      </footer>
    </div>
  )
}

export default WaiverPage
