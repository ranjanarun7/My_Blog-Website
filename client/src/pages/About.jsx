import React from "react";
import { Mail, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";

export default function About() {
  return (
    <div className="min-h-screen bg-white px-4 py-6 md:px-20 md:py-16 font-sans">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 mb-12">
        <img
          src="../../image/about-me1.jpg"
          alt="Author"
          className="w-32 h-32 md:w-48 md:h-56 md:rounded-3xl rounded-full object-cover mt-11 ml-10"
        />
        <div className="text-center md:text-left max-w-lg">
          <h1 className="text-3xl font-semibold mb-2">Meet the Author</h1>
          <p className="text-gray-600 mb-4">
            Hey there! I'm Arun 👋
            <br />
            Welcome to my little corner of the internet! I'm a web developer who
            loves building things on the web, exploring the MERN stack, and
            solving problems with code.
            <br />
            When I’m not coding, you’ll find me reading books, planning a trip,
            or experimenting with new ideas. I started this blog to share what I
            learn — from tech tutorials and coding experiences to thoughts on
            life and personal growth.
            <br />
            Thanks for stopping by! Feel free to reach out or leave a comment
            through the contact section — I’d love to connect.
          </p>
          <Button className="bg-green-600 text-white hover:bg-green-700">
            <a href="https://ranjanarunyadav07.github.io/Portfolio.github.io/">
              More Info
            </a>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-semibold text-lg mb-2">My Journey</h2>
              <p className="text-gray-700">
                I started this blog to share my web development journey,
                simplify complex concepts, and help others learn from my
                experience. It’s a space where I grow by sharing — and
                hopefully, you’ll learn something new too!
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-semibold text-lg mb-2">My Passions</h2>
              <p className="text-gray-700">
                I’m passionate about building clean, user-friendly web
                applications that solve real problems. I love turning ideas into
                working products using the MERN stack, and I’m always excited to
                explore new tools, technologies, and creative solutions.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-semibold text-lg mb-2">Social Media</h2>
              <div className="flex gap-4 text-gray-700 text-2xl">
                <Instagram />
                <Twitter />
                <Facebook />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold text-lg mb-2">Contact Me</h2>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail />
                <span>contact@example.com</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
