"use client";

import { Button } from "./ui/button";
import { Sparkles, Twitter, Github, Mail } from "lucide-react";
import { Input } from "./ui/input";
import { addToNewsletter } from "../actions/newsletter";

export function Footer() {
  const formAction = (formData: FormData) => {
    const email = formData.get("email");
    try {
      addToNewsletter(email as string);
    } catch (err) {
      console.error("Error adding to newsletter");
    }
  };
  return (
    <footer className="bg-white border-t border-slate-200">
      {/* CTA Section */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 py-16" id="waitlist">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-slate-900 mb-4 text-2xl font-bold">
            Ready to take control of your life tasks?
          </h2>
          {/* <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Download OnTrack today and experience life admin without the stress.
            No account needed, completely free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Download for Android
            </Button>
          </div> */}
          <p>
            We're launching soon! Join the waitlist to be the first to know.
          </p>
          <form
            className="mt-4 flex flex-col md:flex-row gap-2 md:justify-center"
            action={formAction}
          >
            <Input
              type="email"
              className="md:w-1/2 border-[#403ca1] bg-white h-[40px]"
              placeholder="Enter your email"
              name="email"
            />
            <Button className="h-[40px]">Submit</Button>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
  <img 
    src="OnTrack_Banner_Logo.webp" 
    alt="OnTrack logo" 
    className="h-25 w-auto mb-3"
  />
</div>
            <p className="text-slate-700 max-w-sm">
              Your personal assistant for adulting tasks. Never miss renewals,
              deadlines, or checkups — with helpful guidance and complete privacy.
            </p>
          </div>

          <div className="">
            <h4 className="text-slate-800 mb-4">Product</h4>
            <ul className="space-y-2 text-slate-800">
              <li>
                <a href="#features" className="hover:text-emerald-600">Features</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-emerald-600">Privacy</a>
              </li>
              {/* <li>
                <a href="#download" className="hover:text-emerald-600">
                  Download
                </a>
              </li> */}
              {/* <li>
                <a href="#help" className="hover:text-emerald-600">
                  Help Center
                </a>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-800 mb-4">Company</h4>
            <ul className="space-y-2 text-slate-800">
              {/* <li>
                <a href="#about" className="hover:text-emerald-600">
                  About
                </a>
              </li> */}
              {/* <li>
                <a href="#blog" className="hover:text-emerald-600">
                  Blog
                </a>
              </li> */}
              <li>
                <a
                  href="mailto:ontrack@gmail.com"
                  className="hover:text-emerald-600"
                >
                  Contact
                </a>
              </li>
              {/* <li>
                <a href="#careers" className="hover:text-emerald-600">
                  Careers
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 OnTrack. All rights reserved. Built with privacy in mind.
          </p>
          <div className="flex items-center gap-4">
            {/* <a
              href="#twitter"
              className="text-slate-400 hover:text-emerald-600"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#github" className="text-slate-400 hover:text-emerald-600">
              <Github className="w-5 h-5" />
            </a> */}
            <a
              href="mailto:ontrack@gmail.com"
              className="text-slate-400 hover:text-emerald-600"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
