import Head from 'next/head';
import { useState } from 'react';
import MarkdownPresenter from '../components/MarkdownPresenter';

export default function Home() {
    const [youtubeLink, setYoutubeLink] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const generateBlog = async () => {
        if (!youtubeLink) {
            alert("Please enter a YouTube link.");
            return;
        }
        setIsLoading(true);  // Start loading
        setBlogContent(''); // Clear previous content

        try {
            const response = await fetch('/api/generate-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: youtubeLink })
            });
            const data = await response.json();
            setBlogContent(data.content);
        } catch (error) {
            console.error("Error occurred:", error);
            alert("Something went wrong. Please try again later.");
        }
        setIsLoading(false);  // Stop loading
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialiased">
            <Head>
                <title>AI Blog Generator</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
            </Head>

            {/* Navbar */}
            <nav className="bg-blue-600 p-4 text-white flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold">AI Blog Generator</h1>
                </div>
                <div>
                    <a href="#" className="text-white hover:underline mx-4">Welcome User</a>
                    <a href="/blog-list" className="text-white hover:underline mx-4">Saved Blog Posts</a>
                    <a href="#" className="text-white hover:underline">Logout</a>
                </div>
            </nav>

            {/* Main content area */}
            <div className="flex-grow container mx-auto mt-10 px-4 sm:px-0">
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Welcome to the AI Blog Generator</h2>
                        <p className="text-gray-700">
                            Generate high-quality blog articles from YouTube videos using artificial intelligence.
                            Simply enter the link to the YouTube video below and let the AI create the content for you!
                        </p>
                    </div>

                    <div className="my-4">
                        <h2 className="text-xl mb-4 font-semibold">Enter Youtube Video Link</h2>
                        <div className="flex space-x-4">
                            <input
                                id="youtubeLink"
                                type="url"
                                placeholder="Paste Youtube Link..."
                                className="flex-grow text-black p-2 border border-blue-400 rounded-l-md"
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                disabled={isLoading}  // Disable input during loading
                            />
                            <button
                                id="generateBlogButton"
                                className={`bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={generateBlog}
                                disabled={isLoading}  // Disable button during loading
                            >
                                Generate
                            </button>
                        </div>
                    </div>

                    {isLoading && <div className="load">Loading...</div>}

                    {blogContent && (
                        <section className="mt-10 flex-grow">
                            <h2 className="text-xl mb-4 font-semibold">Generated Blog Article</h2>
                            <div className="mt-2 text-gray-700 space-y-4">
                                <MarkdownPresenter markdownText={blogContent} />
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <footer className="text-center p-4 text-black mt-6">
                Powered by <a href="https://www.drsyeta.com/">Drsyeta</a>
            </footer>
        </div>
    );
}
