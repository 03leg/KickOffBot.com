import React from 'react'
import ModalVideo from './ModalVideo'
import VideoThumb from 'public/images/video-preview.png'
import { signIn } from 'next-auth/react'

export const Hero = () => {
    return (
        <section className="relative">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center pb-12 md:pb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Make your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">telegram bot</span> without coding</h1>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">Easily create chatbot conversations without coding. Build smart chatbots quickly with our simple tool.</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6" data-aos-delay="300">
                                <a onClick={() => { void signIn(); }} className="rounded-md cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</a>
                                <a href="/docs" className="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <ModalVideo
                    thumb={VideoThumb}
                    thumbWidth={768}
                    thumbHeight={432}
                    thumbAlt="Bot builder demo video"
                    video="https://github.com/03leg/KickOffBot.com/assets/91701505/74ec73bb-ac18-403d-959c-9c023304e3ec"
                    videoWidth={1920}
                    videoHeight={1080} />
            </div>
        </section>
    )
}
