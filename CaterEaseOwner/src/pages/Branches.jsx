import { Link } from "react-router"; // Using react-router-dom for navigation
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptySection from "../components/EmptySection"; // Assuming you have this component
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PlusCircle } from "lucide-react"; // Icon for the "Add Branch" button

// Dummy data for displaying branch cards
const dummyBranches = [
  {
    id: 1,
    name: "Downtown Central",
    owner: "John Doe",
    location: "123 Main Street, Metropolis",
    image: "https://via.placeholder.com/400x200.png?text=Downtown+Branch",
  },
  {
    id: 2,
    name: "Uptown Eatery",
    owner: "Jane Smith",
    location: "456 Oak Avenue, Star City",
    image: "https://via.placeholder.com/400x200.png?text=Uptown+Branch",
  },
  {
    id: 3,
    name: "Riverside Grill",
    owner: "Sam Wilson",
    location: "789 Pine Lane, Gotham",
    image: "https://via.placeholder.com/400x200.png?text=Riverside+Branch",
  },
  {
    id: 4,
    name: "Suburbia Kitchen",
    owner: "Emily White",
    location: "101 Maple Drive, Smallville",
    image: "https://via.placeholder.com/400x200.png?text=Suburbia+Branch",
  },
];

const Branches = () => {
  const branches = dummyBranches;

  return (
    <main className="p-4 sm:p-6 md:p-10">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--primaryFont)">
          Branches
        </h1>
        {/* Button to navigate to the Add Branch page */}
        <Button asChild>
          <Link to="/branches/add-branch">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Branch
          </Link>
        </Button>
      </header>

      {branches && branches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {branches.map((branch) => (
            <Card
              key={branch.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <CardHeader>
                <img
                  src={branch.image}
                  alt={`${branch.name}`}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardTitle className="pt-4 text-(--primaryFont)">
                  {branch.name}
                </CardTitle>
                <CardDescription className="text-(--secondaryFont)">
                  Owner: {branch.owner}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-(--secondaryFont)">{branch.location}</p>
              </CardContent>
              <CardFooter>
                {/* Link to the specific branch's detail page */}
                <Button asChild className="w-full">
                  <Link to={`/branches/${branch.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptySection
          title="No Branches Found"
          message="There are currently no branches to display."
        />
      )}

      {/* Pagination component */}
      <Pagination className="mt-10 text-(--secondaryFont)">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="hover:bg-primary hover:text-white"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="hover:bg-primary hover:text-white"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive
              className="hover:bg-primary hover:text-white"
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="hover:bg-primary hover:text-white"
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              className="hover:bg-primary hover:text-white"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default Branches;
