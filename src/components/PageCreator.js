"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCreator } from "./TableCreator";
import { FormCreator } from "./FormCreator";

export function PageCreator({
  title,
  description,
  data,
  columns,
  formFields,
  onFormSubmit,
  searchable = true,
  searchKeys = [],
  addButtonText = "Add",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredData = searchable
    ? data.filter((item) =>
        searchKeys.some((key) =>
          item[key]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="mb-0 p-4 border-b">
        <h1 className="text-xl font-bold mb-0">{title}</h1>
        {description && (
          <p className="text-gray-500 text-[13px]">{description}</p>
        )}
      </div>

      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {searchable && (
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-2 flex-wrap items-center">
          <FormCreator
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            fields={formFields}
            onSubmit={(data) => {
              onFormSubmit(data);
              setIsFormOpen(false);
            }}
          />
          <Button
            className="bg-blue-600 text-white cursor-pointer"
            onClick={() => setIsFormOpen(true)}
          >
            + {addButtonText}
          </Button>
        </div>
      </div>

      <TableCreator data={filteredData} columns={columns} />
    </div>
  );
}
