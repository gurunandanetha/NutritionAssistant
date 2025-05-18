import SearchSection from "@/components/nutrition/search-section";
import ResultsContainer from "@/components/nutrition/results-container";
import LoadingIndicator from "@/components/nutrition/loading-indicator";
import ErrorState from "@/components/nutrition/error-state";
import { useState } from "react";
import { FoodData } from "@/lib/nutrition-api";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [foodData, setFoodData] = useState<FoodData | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm && !uploadedImage) {
      setHasError(true);
      setErrorMessage("Please enter a food name or upload an image.");
      return;
    }

    setIsLoading(true);
    setHasError(false);
    
    try {
      let response;
      
      if (uploadedImage) {
        // Create form data to send the image
        const formData = new FormData();
        formData.append("image", uploadedImage);
        
        // If there's also a search term, append it
        if (searchTerm) {
          formData.append("query", searchTerm);
        }
        
        response = await fetch("/api/food/image", {
          method: "POST",
          body: formData,
        });
      } else {
        // Text-based search
        response = await fetch(`/api/food?query=${encodeURIComponent(searchTerm)}`);
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setFoodData(data);
    } catch (error) {
      console.error("Search error:", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetSearch = () => {
    setSearchTerm("");
    setUploadedImage(null);
    setImagePreviewUrl(null);
    setFoodData(null);
    setHasError(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 mb-16">
      {/* Hero Section */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
            Your Smart AI Nutrition Assistant
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-8 dark:text-neutral-300">
            Discover the nutritional value, health benefits, and potential side effects of any food - all in one place.
          </p>
          
          {/* Hero image */}
          <div className="rounded-xl overflow-hidden shadow-lg mb-8">
            <img 
              src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500&q=80" 
              alt="Assortment of healthy foods" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Search Section (only show if no results) */}
      {!foodData && !isLoading && !hasError && (
        <SearchSection 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          imagePreviewUrl={imagePreviewUrl}
          setImagePreviewUrl={setImagePreviewUrl}
        />
      )}

      {/* Loading State */}
      {isLoading && <LoadingIndicator />}

      {/* Error State */}
      {hasError && (
        <ErrorState 
          message={errorMessage} 
          onTryAgain={resetSearch} 
        />
      )}

      {/* Results Container */}
      {foodData && !isLoading && !hasError && (
        <ResultsContainer 
          foodData={foodData} 
          onSearchAgain={resetSearch} 
        />
      )}
    </main>
  );
};

export default Home;
