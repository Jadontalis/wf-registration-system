"use client"

import React, { useState, useRef } from 'react'
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
        <h3 className="text-lg font-bold mt-6 mb-2">Competitor Rules</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Teams consist of a horse, rider, and skier/snowboarder. Minimum human competitor age: 13.</li>
          <li>Each team receives one run per day.</li>
          <li>No substitutions allowed after Friday at 9:00 PM.</li>
          <li>If any team member cannot compete, the team will be scratched.</li>
          <li>No refunds issued after Friday at 9:00 PM.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Entry Fees</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Novice – $100/team</li>
          <li>Snowboard – $150/team</li>
          <li>Sport – $150/team</li>
          <li>Open – $200/team</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Horse Limits</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Horses may only compete in one division with the exception of Snowboard.</li>
          <li>Max 2 runs per horse per day.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Skier/Snowboarder Limits</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Skiers may compete in one division with the exception of Snowboard.</li>
          <li>Novice: up to 3 runs</li>
          <li>Sport/Open: up to 4 runs</li>
          <li>Snowboarders: up to 3 runs</li>
          <li>Helmets required; eye protection recommended.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Rider Limits</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Riders may compete in multiple divisions.</li>
          <li>Up to 4 runs per day, with the exception of Snowboard.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Overall Limits</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>No competitor may be on more than 7 teams.</li>
          <li>No identical team (same 3 heartbeats) may run more than once per day.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">Division Rules</h2>
        
        <h3 className="text-lg font-bold mt-6 mb-2">Novice Division</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>For beginning-level competitors and horses.</li>
          <li>1st-place Horse or Skier Novice winners must move up unless approved.</li>
          <li>Competitors must have under 3 seasons experience unless approved.</li>
          <li>Entry Fee: $100</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Snowboard Division</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Horse, rider, snowboarder teams.</li>
          <li>Entry Fee: $150</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Sport Division</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>For intermediate-level competitors.</li>
          <li>1st-place Horse or Skier Sport winners must move to Open unless approved.</li>
          <li>Entry Fee: $150</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Open Division</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Highest-level division.</li>
          <li>Open riders may compete in Sport with Sport-level horse/skier.</li>
          <li>Open riders (current or past) may not compete in Novice.</li>
          <li>Entry Fee: $200</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Exception Requests</h3>
        <p className="mb-4">Must be emailed to competitors.wfskijoring@gmail.com before Friday registration closes.</p>

        <h2 className="text-xl font-bold mt-8 mb-4">Safety, Sportsmanship & Conduct</h2>

        <h3 className="text-lg font-bold mt-6 mb-2">Unsafe Behavior</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Unsafe behavior may result in disqualification from current or future events.</li>
          <li>Reports may be submitted by competitors, staff, or volunteers.</li>
          <li>Decisions made by 3+ race officials; final.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Sportsmanship</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Respect toward horses, competitors, volunteers, and officials required.</li>
          <li>Unsportsmanlike conduct may result in disqualification from current or future events.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Competitor Behavior</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Non-competitors may not ride or be pulled by horses.</li>
          <li>Horses prohibited from spectator areas.</li>
          <li>Dogs must be restrained during race hours.</li>
          <li>Competitors responsible for guests.</li>
          <li>Keep nonessential people out of staging area.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Human Health</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Medical care/transport costs are the responsibility of the recipient.</li>
          <li>Officials may disqualify competitors deemed unfit to compete.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Horse Health</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Veterinarian may scratch horses for welfare concerns.</li>
          <li>Veterinarian services costs are the responsibility of the recipient.</li>
          <li>Horse ambulance donated and provided by Rebecca Farm.</li>
          <li>Veterinarian provided by LaSalle Veterinary Clinic.</li>
          <li>Bell & splint boots & traction shoes recommended.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">The Course</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>800–1000 feet long with ample run out</li>
          <li>Skier passes right of red, left of blue gates.</li>
          <li>3–4 jumps, 3–5 feet.</li>
          <li>Difficulty increases by division.</li>
          <li>Course maps posted online.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Course Walk-Through</h3>
        <p className="mb-4">Allowed before race start and before division starts.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">Scratching</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Refund only if scratched before first run Saturday.</li>
          <li>No refunds afterward.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">Equipment Rules</h2>

        <h3 className="text-lg font-bold mt-6 mb-2">Skier Rope</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Max length: 33 ft.</li>
          <li>Min diameter: ⅜ inch.</li>
          <li>No handles or devices; one knot allowed at the end</li>
          <li>Non-event ropes require inspection.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Rope Attachment</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Attach to saddle horn or primary rigging.</li>
          <li>Must begin within 9 inches of cantle.</li>
          <li>Incorrect rigging → correction and restart; second failure = DQ.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Rings</h3>
        <p className="mb-4">Only event-provided rings allowed, no batons.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">Saddles</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Must be free of impediments.</li>
          <li>No extra ropes, saddle bags, firearm holsters.</li>
          <li>Night latches, tapaderos, approved gear allowed.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">Race Procedures</h2>

        <h3 className="text-lg font-bold mt-6 mb-2">Run Order</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Posted online and at start gate.</li>
          <li>Change requests allowed before division start.</li>
          <li>Sunday changes must be emailed by 10 PM Saturday.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Start Gate Procedures</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Competitors must be ready when called.</li>
          <li>Valid delays may result in resequencing.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Sparby Rule</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Three minutes to start after 'Course Clear.'</li>
          <li>1st timeout → end of division.</li>
          <li>2nd timeout → DNS.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Start Rules & Restarts</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Time starts when skier’s boots cross start line.</li>
          <li>Rope drop before crossing allows restart.</li>
          <li>Max 2 immediate restarts.</li>
          <li>Two failures to stop before halfway = no further attempts.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Timing Equipment</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Electronic timing with backup hand timing.</li>
          <li>Hitting start timer → 2-second penalty.</li>
          <li>Hitting finish timer → DNF.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Penalties</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Missed gate → 2 seconds.</li>
          <li>Horse hitting skier gate → 2 seconds.</li>
          <li>Breaking jump plane → 2 seconds.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Finish Requirements</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Skier must be upright and holding rope.</li>
          <li>Rider must be mounted.</li>
          <li>Rings counted only if in possession.</li>
          <li>Horse crossing finish on skier side causing timer stop → DNF.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">Protests, Results, Awards & Contacts</h2>

        <h3 className="text-lg font-bold mt-6 mb-2">Penalty Protests</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Must be reported before leaving finish area and will pause the race</li>
          <li>Reviewed by arena judges and Head of Flaggers.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Other Protests</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Submit same day via email or voicemail.</li>
          <li>Reviewed by 3+ officials; final.</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Results</h3>
        <p className="mb-4">Posted online and in print after each race day.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">Awards</h3>
        <p className="mb-4">Buckles, money, and prizes awarded Sunday night.</p>

        <h3 className="text-lg font-bold mt-6 mb-2">Contacts</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>General questions: competitors.wfskijoring@gmail.com</li>
          <li>Exception requests: Email before registering competitors.wfskijoring@gmail.com</li>
          <li>Substitutions/cancellations before Fri 9 PM: (406) 260-8725</li>
          <li>Saturday scratches: Email or call; timestamps used</li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-2">Vet/Medical:</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Brock Bolin: (815) 980-6222</li>
          <li>Taryne Haskamp: (616) 322-7143</li>
        </ul>
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
