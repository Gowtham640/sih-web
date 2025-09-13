import React from 'react';

export default function CoachDashboard() {
    return(
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center">
                <p className='absolute text-white font-roboto font-bold text-2xl '>Coach Dashboard</p>
                <button className="absolute right-3 font-roboto font-bold text-2xl flex text-center bg-white text-blue-900 px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Home</button>
            </div>
            
            {/* Main Content Area */}
            <div className="bg-white h-2/3 flex items-center justify-center px-8">
                <div className="flex gap-8 max-w-6xl w-full">
                    {/* Card 1 - Upload Video */}
                    <div className="relative bg-white border-4  border-gray-200 rounded-2xl h-[40vh] shadow-lg hover:shadow-xl transition-shadow p-6 flex-1 flex flex-col items-center text-center">
                        <p className="text-gray-800 font-sans font-bold mb-6 text-2xl">
                            Uploads reference exercise video and defines drills / tests
                        </p>
                        <button className="absolute bg-gradient-to-r from-purple-900 to-blue-900 top-[30vh] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                            Upload Video
                        </button>
                    </div>
                    <div className="relative bg-white border-4 border-gray-200 rounded-2xl h-[40vh] shadow-lg hover:shadow-xl transition-shadow p-6 flex-1 flex flex-col items-center  text-center">
                        <p className="text-gray-800 font-sans font-bold mb-6 text-2xl">
                            Assign tests and drills from dashboard
                        </p>
                        <button className="absolute font-roboto font-medium bg-gradient-to-r from-purple-900 to-blue-900 text-white top-[30vh] px-8 py-3 rounded-lg  hover:opacity-90 transition-opacity">
                            Upload Video
                        </button>
                    </div>
                    <div className="bg-white border-4 relative border-gray-200 rounded-2xl h-[40vh] shadow-lg hover:shadow-xl transition-shadow p-6 flex-1 flex flex-col items-center  text-center">
                        <p className="text-gray-800 font-sans font-bold mb-6 text-2xl">
                            Review test results ,clips and reports
                        </p>
                        <button className="absolute bg-gradient-to-r from-purple-900 to-blue-900 text-white top-[30vh] px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                            Upload Video
                        </button>
                    </div>
                    

                </div>
            </div>
        </div>
    )
}

