import LandingNav from "@/components/landingNav";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <LandingNav />
      {/* <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex"> */}
      {/* <div className="bg-card p-4 border border-spacing-">Hii</div>
        <Button>Worked? click here!!</Button> */}
      <div className="flex flex-col items-center justify-center min-h-screen flex-1 w-full max-w-2xl text-center">
        {/* <img
          src="/placeholder.svg"
          alt="Speck Icon"
          className="w-20 h-20 mb-6"
          width="80"
          height="80"
          style={{ aspectRatio: "80/80", objectFit: "cover" }}
        /> */}
        <h1 className="text-6xl font-extrabold leading-tight">
          Bite-Sized Learning for Busy Minds
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover a seamless way to integrate continuous learning into your
          daily routine with Speck's SaaS platform.
        </p>
        <div className="flex items-center mt-6 space-x-4">
          <button
            id="joinForFree"
            className="px-6 py-3 text-white bg-black rounded-lg"
          >
            Join for free
          </button>
          <button className="px-6 py-3 text-black bg-gray-200 rounded-lg">
            See our plans
          </button>
        </div>
      </div>
      <div className="w-full max-w-md mt-12">
        <p className="mb-4 text-lg text-gray-600">
          Speck is a SaaS platform that offers bite-sized learning content to
          help busy professionals integrate continuous learning into their daily
          routines. Our platform features a wide range of topics, from business
          and technology to personal development and wellness.
        </p>
        <p className="mb-4 text-lg text-gray-600">
          With Speck, you can access high-quality learning content in short,
          digestible formats that fit seamlessly into your busy schedule.
          Whether you're commuting, waiting in line, or taking a break, Speck
          makes it easy to learn and grow.
        </p>
        <p className="mb-4 text-lg text-gray-600">
          Our platform is designed to be user-friendly and engaging, with
          features like personalized recommendations, progress tracking, and
          social learning communities. We believe that continuous learning is
          the key to personal and professional growth, and we're committed to
          making it accessible and enjoyable for everyone.
        </p>
        <p className="mb-4 text-lg text-gray-600">
          Join the thousands of learners who have already discovered the power
          of Speck and start your journey towards a more informed and empowered
          future.
        </p>
      </div>
      {/* </div> */}
    </main>
  );
}
