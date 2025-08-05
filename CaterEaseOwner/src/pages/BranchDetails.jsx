import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MapPin,
  User,
  Tag,
  Star,
  Clock,
  Truck,
  Info,
  Pencil,
  ChevronRight,
} from "lucide-react";
import BranchDetailsSkeleton from "@/components/skeleton/BranchDetailsSkeleton";

const branchData = {
  id: 2,
  description: "Shami Taste Mezzeh",
  location_note: "Near Mezzeh Autostrad",
  phone: "123-456-7890",
  manager_name: "Alex Green",
  restaurant_photo: "https://via.placeholder.com/150x150.png?text=Logo",
  categories: ["Eastern", "Grill", "Traditional"],
  occasions: ["Family Dinners", "Business Lunch", "Special Events"],
  working_hours: [
    { day: "Monday", hours: "10:00 AM - 11:00 PM" },
    { day: "Tuesday", hours: "10:00 AM - 11:00 PM" },
    { day: "Wednesday", hours: "10:00 AM - 11:00 PM" },
    { day: "Thursday", hours: "10:00 AM - 11:00 PM" },
    { day: "Friday", hours: "10:00 AM - 12:00 AM" },
    { day: "Saturday", hours: "09:00 AM - 12:00 AM" },
    { day: "Sunday", hours: "Closed" },
  ],
  services: [
    {
      name: "Open Buffet",
      description: "All-you-can-eat buffet service.",
      price: "110.00",
    },
    {
      name: "Catering",
      description: "Full-service catering for parties and events.",
      price: "500.00+",
    },
  ],
  delivery_regions: [
    {
      name: "Downtown Metropolis",
      description: "Estimated delivery time: 30-45 mins",
      price: "5.00",
    },
    {
      name: "Uptown Star City",
      description: "Estimated delivery time: 45-60 mins",
      price: "7.50",
    },
  ],
};

const BranchDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [branch, setBranch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setBranch(branchData);
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return <BranchDetailsSkeleton />;
  }

  return (
    <main className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between font-bold mb-8">
        <span className="text-xl sm:text-2xl text-(--primaryFont)">
          {branch.description}
        </span>
        <div className="flex items-center text-sm sm:text-base gap-1 sm:gap-2 font-medium text-(--secondaryFont)">
          <div
            className="hover:text-(--primary) transition-colors cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Branches
          </div>
          <ChevronRight size={20} className="h-4 w-4" />
          <span className="text-(--primary)">{branch.description}</span>
        </div>
      </header>
      {/* Main Details Card */}
      <Card className="mb-8 shadow-lg">
        <CardHeader className="relative">
          {/* Edit Button */}
          <Button
            asChild
            variant="outline"
            size="icon"
            className="absolute top-4 right-4"
          >
            <Link to={`edit-branch`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={branch.restaurant_photo}
              alt={branch.description}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md"
            />
            <div className="flex-1 pt-2">
              <CardTitle className="text-3xl font-bold text-(--primaryFont)">
                {branch.description}
              </CardTitle>
              <CardDescription className="text-(--secondaryFont) flex items-center pt-2">
                <MapPin className="w-4 h-4 mr-2" />
                {branch.location_note}
              </CardDescription>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-center text-(--secondaryFont)">
                  <Phone className="w-5 h-5 mr-3 text-(--primaryFont)" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-center text-(--secondaryFont)">
                  <User className="w-5 h-5 mr-3 text-(--primaryFont)" />
                  <span>Manager: {branch.manager_name}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-(--primaryFont) flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {branch.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Occasions Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-(--primaryFont) flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Perfect For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {branch.occasions.map((occasion, index) => (
                <Badge key={index} variant="outline">
                  {occasion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Working Hours Card */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl text-(--primaryFont) flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {branch.working_hours.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b pb-2 last:border-none"
                >
                  <span className="font-medium text-(--primaryFont)">
                    {item.day}
                  </span>
                  <span
                    className={`text-(--secondaryFont) ${
                      item.hours === "Closed"
                        ? "font-semibold text-red-500"
                        : ""
                    }`}
                  >
                    {item.hours}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Other Services Card */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl text-(--primaryFont) flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Other Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {branch.services.map((service, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row justify-between border-b pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-(--primaryFont)">
                      {service.name}
                    </p>
                    <p className="text-sm text-(--secondaryFont)">
                      {service.description}
                    </p>
                  </div>
                  <p className="font-bold text-(--primaryFont) text-right sm:text-left mt-1 sm:mt-0">
                    ${service.price}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Delivery Regions Card */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl text-(--primaryFont) flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Delivery Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {branch.delivery_regions.map((region, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row justify-between border-b pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-(--primaryFont)">
                      {region.name}
                    </p>
                    <p className="text-sm text-(--secondaryFont)">
                      {region.description}
                    </p>
                  </div>
                  <p className="font-bold text-(--primaryFont) text-right sm:text-left mt-1 sm:mt-0">
                    ${region.price}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default BranchDetails;
