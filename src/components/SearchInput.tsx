"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
    placeholder?: string;
    queryKey: string;
};

export default function SearchInput({ placeholder, queryKey }: Props) {
    const {replace} = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [term, setTerm] = useState( searchParams.get(queryKey)?.toString() || "");

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        if(term){
            params.set(queryKey, term);
        }else{
            params.delete(queryKey);
        }

        replace(`${pathname}?${params.toString()}`);
    };


    // const handleSearch = useDebouncedCallback((value) => {
    //     const params = new URLSearchParams(searchParams.toString());
    //     params.set(queryKey, value);
    //     router.push(`${pathname}?${params.toString()}`);
    // }, 1000);

    return (
    <div className="form-control w-full max-w-sm">
      <div className="flex gap-3"> {/* 2. Bungkus dengan 'join' agar tombol menempel */}

        <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
                >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input
                type="search"
                className="grow"
                placeholder="Search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    handleSearch();
                    }
                }}
                />
            {/* <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd> */}
        </label>
        <button 
          className="btn btn-primary join-item" 
          onClick={handleSearch}
        >
          Cari
        </button>
      </div>
    </div>
    );
}


