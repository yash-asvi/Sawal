import React, { useState } from 'react'

import axios from 'axios'
import './index.css'

function App() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [furtherQuestion, setFurtherQuestion] = useState('')

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setUploadedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleFindAnswer = async () => {
    if (!uploadedFile || !prompt || isLoading) return

    setIsLoading(true)

    try {
      const base64ImageData = await getBase64(uploadedFile)
      const fullPrompt = `You are an expert teacher and your student has asked you to explain the following homework problem. Please provide a detailed explanation.\n\nUSER:\n${prompt}`
      callModelApi(fullPrompt, base64ImageData, (apiResponse) => {
        setResponse(apiResponse)
        setIsLoading(false)
      })
    } catch (error) {
      console.error('API call failed:', error)
      setResponse('Error fetching response from model API.')
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!uploadedFile || !prompt || isLoading) return
    await handleFindAnswer()
  }

  const handleFurtherQuestion = async () => {
    if (!uploadedFile || !furtherQuestion || isLoading) return

    setIsLoading(true)

    try {
      const base64ImageData = await getBase64(uploadedFile)
      const fullPrompt = `You are an expert teacher and your student has asked you to explain the following homework problem. Please provide a detailed explanation.\n\nUSER:\n${prompt}\n\nRESPONSE:\n${response}\n\nFURTHER QUESTION:\n${furtherQuestion}`
      callModelApi(fullPrompt, base64ImageData, (apiResponse) => {
        setResponse(apiResponse)
        setFurtherQuestion('')
        setIsLoading(false)
      })
    } catch (error) {
      console.error('API call failed:', error)
      setResponse('Error fetching response from model API.')
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    // Clear all state values
    setUploadedFile(null)
    setPreviewUrl(null)
    setPrompt('')
    setResponse('')
    setFurtherQuestion('')

    // Reset the input element's value
    const inputElement = document.getElementById('upload')
    if (inputElement) {
      inputElement.value = '' // Reset input element value
    }
  }

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-900 text-gray-200'>
      <header className='bg-gradient-to-r from-purple-700 to-indigo-700 py-4 w-full text-center mb-8'>
        <h1 className='text-2xl font-bold text-center font-sans'>
          Sawal - Homework Helper
        </h1>
      </header>

      <main className='max-w-5xl w-full px-4'>
        <div className='mb-4 text-center'>
          <p className='text-white-400 font-sans'>
            Welcome to Sawal - your friendly homework helper! Upload an image of
            your homework problem and ask a question or provide a prompt related
            to it. Sawal will provide you with a detailed explanation of the
            problem.
          </p>
        </div>
        <div className='bg-gray-800 shadow-md rounded-md p-4 mb-4'>
          <label
            htmlFor='upload'
            className='flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-600 rounded-md cursor-pointer h-72'
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='Uploaded Image'
                className='max-h-64 w-full object-contain'
              />
            ) : uploadedFile ? (
              <span className='text-gray-400'>{uploadedFile.name}</span>
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-12 w-12 mb-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <span>Upload Image of your Homework Problem</span>
              </div>
            )}
            <input
              id='upload'
              type='file'
              className='hidden'
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {!response && (
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Enter your question or prompt'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans'
            />
          </div>
        )}
        <div className='mb-4'>
          <div className='bg-gray-800 p-4 rounded-md shadow-md'>
            {response ? (
              <div>
                <p className='text-gray-200 font-sans'>{response}</p>
                <div className='mt-4 flex justify-center space-x-4'>
                  <input
                    type='text'
                    placeholder='Ask further question'
                    value={furtherQuestion}
                    onChange={(e) => setFurtherQuestion(e.target.value)}
                    className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans'
                  />
                  <button
                    onClick={handleFurtherQuestion}
                    disabled={!uploadedFile || !furtherQuestion || isLoading}
                    className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                      !uploadedFile || !furtherQuestion || isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    Ask Further
                  </button>
                  <button
                    onClick={handleRegenerate}
                    disabled={!uploadedFile || !prompt || isLoading}
                    className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                      !uploadedFile || !prompt || isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!uploadedFile && !prompt && !response}
                    className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                      !uploadedFile && !prompt && !response
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <p className='text-gray-400 font-sans font-italic'>
                {isLoading
                  ? 'We are working on your answer!'
                  : 'Your answer will be here.'}
              </p>
            )}
          </div>
        </div>
        {!response && (
          <div className='flex justify-center space-x-4'>
            <button
              onClick={handleFindAnswer}
              disabled={!uploadedFile || !prompt || isLoading}
              className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                !uploadedFile || !prompt || isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Find answer
            </button>
            <button
              onClick={handleClear}
              disabled={!uploadedFile && !prompt}
              className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                !uploadedFile && !prompt
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Clear
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Extract base64 data from the result
      const base64Data = reader.result.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = (error) => reject(error)
  })
}

const callModelApi = async (prompt, imageData, callback) => {
  const url = 'http://35.233.231.20:5003/api/generate'
  const headers = { 'Content-Type': 'application/json' }
  const data = {
    model: 'llava:34b-v1.6',
    prompt: prompt,
    stream: false,
    images: [imageData],
  }
  console.log(data)

  try {
    const response = await axios.post(url, data, { headers })

    // Extract 'response' from the JSON object
    const apiResponse = response.data.response

    // Call the callback function with the response
    callback(apiResponse)
  } catch (error) {
    console.error('Error:', error)
    if (error.response && error.response.data) {
      console.log('Response Data:', error.response.data)
      callback(`Error: ${error.response.data.error}`)
    } else {
      callback(`Error: ${error.message}`)
    }
  }
}

export default App
