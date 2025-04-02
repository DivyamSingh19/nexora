'use client';

import { useState } from 'react';
import { ethers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client';

 
const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

 
// import marketplaceAbi from '../artifacts/contracts/Marketplace.json';
// import nftAbi from '../artifacts/contracts/NFT.json';

export default function Create() {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get contract addresses from environment variables
  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
  const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS;

  // Function to connect to the blockchain and get contract instances
  const getContracts = async () => {
    try {
      // Check if window.ethereum exists (MetaMask is installed)
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this dApp");
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create a provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create contract instances
      const marketplace = new ethers.Contract(
        marketplaceAddress,
        marketplaceAbi.abi,
        signer
      );
      
      const nft = new ethers.Contract(
        nftAddress,
        nftAbi.abi,
        signer
      );

      return { marketplace, nft };
    } catch (error) {
      console.error("Failed to connect to contracts:", error);
      setErrorMessage("Failed to connect to blockchain. Please ensure MetaMask is connected.");
      throw error;
    }
  };

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setErrorMessage('');
    
    if (typeof file !== 'undefined') {
      try {
        setIsLoading(true);
        const result = await client.add(file);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
        setIsLoading(false);
      } catch (error) {
        console.error("IPFS image upload error:", error);
        setErrorMessage("Failed to upload image to IPFS. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const createNFT = async () => {
 
    if (!image) {
      setErrorMessage("Please upload an image");
      return;
    }
    if (!name) {
      setErrorMessage("Please provide a name");
      return;
    }
    if (!description) {
      setErrorMessage("Please provide a description");
      return;
    }
    if (!price) {
      setErrorMessage("Please set a price");
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    
    try {
       
      const { marketplace, nft } = await getContracts();
      
       
      const result = await client.add(JSON.stringify({ image, price, name, description }));
      await mintThenList(result, marketplace, nft);
      
       
      setImage('');
      setName('');
      setDescription('');
      setPrice(null);
      setSuccessMessage("NFT created and listed successfully!");
    } catch (error) {
      console.error("NFT creation error:", error);
      setErrorMessage("Failed to create and list NFT. Please try again.");
    }
    
    setIsLoading(false);
  };

  const mintThenList = async (result, marketplace, nft) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    
   
    const mintTx = await nft.mint(uri);
    await mintTx.wait();
    
     
    const id = await nft.tokenCount();
    
     
    const approvalTx = await nft.setApprovalForAll(marketplace.address, true);
    await approvalTx.wait();
    
    
    const listingPrice = ethers.utils.parseEther(price.toString());
    const listingTx = await marketplace.makeItem(nft.address, id, listingPrice);
    await listingTx.wait();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create and List NFT</h1>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-4">
            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={uploadToIPFS}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Image Preview:</p>
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="mt-2 h-40 object-contain"
                  />
                </div>
              )}
            </div>
            
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="NFT Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="NFT Description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (ETH)
              </label>
              <input
                type="number"
                value={price || ''}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.01"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Submit button */}
            <button
              onClick={createNFT}
              disabled={isLoading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : 'Create & List NFT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}