import { createContext, useContext, useState } from "react";

const SearchContext = createContext(undefined);

export const useSearch = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
    return ctx;
};

export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};


