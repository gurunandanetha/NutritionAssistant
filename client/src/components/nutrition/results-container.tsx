import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FoodData, NutrientItem } from "@/lib/nutrition-api";

interface ResultsContainerProps {
  foodData: FoodData;
  onSearchAgain: () => void;
}

const nutrientColors: Record<string, string> = {
  "Protein": "bg-primary-400",
  "Carbohydrates": "bg-accent-500",
  "Fat": "bg-secondary-400",
  "Fiber": "bg-purple-400",
  "Sugar": "bg-red-400"
};

const ResultsContainer = ({ foodData, onSearchAgain }: ResultsContainerProps) => {
  const { 
    name, 
    description, 
    image, 
    nutrition,
    healthBenefits,
    cautions,
    additionalInfo,
    similarFoods
  } = foodData;

  return (
    <div id="results-container" className="max-w-4xl mx-auto animate-in fade-in">
      {/* Back button */}
      <div className="mb-4 animate-in slide-in-from-left-5 duration-300">
        <Button
          onClick={onSearchAgain}
          variant="outline"
          className="flex items-center gap-2 transform transition-all hover:translate-x-[-5px] group"
        >
          <span className="material-icons group-hover:animate-pulse">arrow_back</span>
          <span>Back to Search</span>
        </Button>
      </div>
    
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-2 dark:text-white animate-in zoom-in duration-500">{name}</h2>
        <p className="text-neutral-600 dark:text-neutral-400 animate-in fade-in duration-700">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Left column: Nutrition facts */}
        <Card className="overflow-hidden scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold dark:text-white">Nutrition Facts</h3>
              <span className="material-icons text-primary-500">nutrition</span>
            </div>
            
            {/* Food image */}
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                id="food-image" 
                src={image} 
                alt={name} 
                className="w-full h-auto"
              />
            </div>
            
            {/* Nutrition summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-neutral-50 p-4 rounded-lg text-center dark:bg-neutral-900">
                <p className="text-neutral-600 text-sm dark:text-neutral-400">Calories</p>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{nutrition.calories}</p>
                <p className="text-neutral-500 text-xs">kcal</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg text-center dark:bg-neutral-900">
                <p className="text-neutral-600 text-sm dark:text-neutral-400">Serving</p>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{nutrition.serving}</p>
                <p className="text-neutral-500 text-xs">grams</p>
              </div>
            </div>
            
            {/* Nutrition details */}
            <div className="space-y-4">
              {nutrition.nutrients.map((item: NutrientItem, index: number) => (
                <div key={index} className="flex justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${nutrientColors[item.name] || "bg-primary-400"}`}
                    ></div>
                    <span className="text-neutral-800 dark:text-neutral-200">{item.name}</span>
                  </div>
                  <div className="font-medium dark:text-white">
                    <span>{item.amount}</span>
                    <span className="text-neutral-500 text-sm ml-1 dark:text-neutral-400">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Right column: Health benefits + cautions */}
        <div className="space-y-6">
          {/* Health benefits */}
          <Card className="overflow-hidden scale-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold dark:text-white">Health Benefits</h3>
                <span className="material-icons text-green-500">favorite</span>
              </div>
              
              <ul className="space-y-3">
                {healthBenefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex">
                    <span className="material-icons text-primary-500 mr-2 flex-shrink-0">check_circle</span>
                    <span className="dark:text-neutral-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Cautions */}
          <Card className="overflow-hidden scale-in" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold dark:text-white">Be Careful Because</h3>
                <span className="material-icons text-amber-500">warning</span>
              </div>
              
              <ul className="space-y-3">
                {cautions.map((caution: string, index: number) => (
                  <li key={index} className="flex">
                    <span className="material-icons text-amber-500 mr-2 flex-shrink-0">info</span>
                    <span className="dark:text-neutral-300">{caution}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Additional information */}
      {additionalInfo && (
        <Card className="mb-10 overflow-hidden scale-in" style={{ animationDelay: "0.4s" }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold dark:text-white">Additional Information</h3>
              <span className="material-icons text-blue-500">info</span>
            </div>
            
            <div className="prose max-w-none dark:prose-invert">
              <p className="dark:text-neutral-300">{additionalInfo}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Similar healthy alternatives */}
      {similarFoods && similarFoods.length > 0 && (
        <Card className="mb-10 overflow-hidden scale-in" style={{ animationDelay: "0.5s" }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold dark:text-white">Similar Healthy Alternatives</h3>
              <span className="material-icons text-primary-500">swap_horiz</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similarFoods.map((food, index) => (
                <div key={index} className="text-center">
                  <div className="rounded-full overflow-hidden w-16 h-16 mx-auto mb-2 bg-neutral-100 dark:bg-neutral-800">
                    <img 
                      src={food.image} 
                      alt={food.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-medium text-sm dark:text-white">{food.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Analyze another food button */}
      <div className="text-center mb-10 animate-in fade-in duration-700 delay-700">
        <Button 
          type="button"
          id="analyze-again-btn"
          className="bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-black text-white font-medium py-4 px-6 h-auto text-lg shadow-lg transition-all transform hover:scale-105"
          onClick={onSearchAgain}
        >
          <span className="material-icons mr-2">add_circle</span>
          <span>Analyze Another Food</span>
        </Button>
      </div>
    </div>
  );
};

export default ResultsContainer;
