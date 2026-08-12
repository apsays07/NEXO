"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import { ListedIPO } from "@/types/nexo";
import {
  Plus,
  TrendUp,
  Users,
  CheckCircle,
  Coins,
  Trash,
  X,
  Buildings,
  MagnifyingGlass,
  User,
} from "@phosphor-icons/react";

export function IPOWorkspaceView() {
  const {
    listedIpos,
    addListedIpo,
    deleteListedIpo,
    currentUserRole,
    currentMember,
    searchQuery,
  } = useNexo();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Admin Adding a Listed IPO Card
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Mainboard" | "SME">("Mainboard");
  const [lotsAllotted, setLotsAllotted] = useState<number>(1);
  const [applicantsCount, setApplicantsCount] = useState<number>(1);
  const [oneLotProfit, setOneLotProfit] = useState<number>(15000);
  const [totalProfit, setTotalProfit] = useState<number>(15000);
  const [userProfitShare, setUserProfitShare] = useState<number>(15000);
  const [listingDate, setListingDate] = useState("22 Aug 2026");
  const [lotPrice, setLotPrice] = useState<number>(15000);

  // Filter listed IPOs by search query
  const filteredListedIpos = listedIpos.filter((ipo) =>
    ipo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUserName = currentMember?.name || "Niranjan";
  const activeUserId = currentMember?.id || "mem_1";

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addListedIpo({
      name: name.trim(),
      category,
      lotsAllotted: Number(lotsAllotted) || 1,
      applicantsCount: Number(applicantsCount) || 1,
      oneLotProfit: Number(oneLotProfit) || 0,
      totalProfit: Number(totalProfit) || 0,
      listingDate: listingDate.trim() || "Just Now",
      lotPrice: Number(lotPrice) || 15000,
      userProfits: [
        {
          memberId: activeUserId,
          memberName: activeUserName,
          profit: Number(userProfitShare) || Number(oneLotProfit) || 0,
        },
      ],
    });

    // Reset Form
    setName("");
    setLotsAllotted(1);
    setApplicantsCount(1);
    setOneLotProfit(15000);
    setTotalProfit(15000);
    setUserProfitShare(15000);
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12 animate-fade-in font-sans">
      {/* HEADER SECTION */}
      <div className="p-6 md:p-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Buildings size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                IPO Workspace • Track Record
              </h1>
              <p className="text-xs md:text-sm font-semibold text-slate-500">
                Previous Listed IPO performance, allotted lots & profit ledger.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN ADD LISTED IPO MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                  <Plus size={16} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Add Previous Listed IPO Card
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Record listed IPO allotment & profit metrics
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-700 mb-1">Company / IPO Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Technologies"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as "Mainboard" | "SME")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="Mainboard">Mainboard</option>
                    <option value="SME">SME</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Number of IPO Allotted (Lots)</label>
                  <input
                    type="number"
                    min={1}
                    value={lotsAllotted}
                    onChange={(e) => setLotsAllotted(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Number of Applicants</label>
                  <input
                    type="number"
                    min={1}
                    value={applicantsCount}
                    onChange={(e) => setApplicantsCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">1 Lot Profit (₹)</label>
                  <input
                    type="number"
                    value={oneLotProfit}
                    onChange={(e) => setOneLotProfit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">User Profit ({activeUserName}) (₹)</label>
                  <input
                    type="number"
                    value={userProfitShare}
                    onChange={(e) => setUserProfitShare(Number(e.target.value))}
                    className="w-full bg-blue-50 border border-blue-300 rounded-xl px-3.5 py-2.5 text-blue-900 font-mono font-bold focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Total Syndicate Profit (₹)</label>
                  <input
                    type="number"
                    value={totalProfit}
                    onChange={(e) => setTotalProfit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Listing Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 22 Aug 2026"
                    value={listingDate}
                    onChange={(e) => setListingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-extrabold hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Add Listed IPO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTED IPO CARDS GRID (STRICTLY 3 WIDER CARDS PER ROW) */}
      {filteredListedIpos.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <MagnifyingGlass size={32} className="text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Listed IPO Cards Found</h3>
          <p className="text-xs text-slate-500">
            {searchQuery ? `No results matching "${searchQuery}"` : "No listed IPO cards present."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {filteredListedIpos.map((ipo) => {
            // Find User Profit for active member
            const myProfitEntry = ipo.userProfits?.find(
              (u) =>
                u.memberId === activeUserId ||
                u.memberName?.toLowerCase() === activeUserName.toLowerCase()
            );
            const myProfitAmount = myProfitEntry ? myProfitEntry.profit : ipo.oneLotProfit;

            return (
              <div
                key={ipo.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                {/* CARD TOP HEADER */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {ipo.logo || ipo.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                          {ipo.name}
                        </h3>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold rounded bg-slate-100 text-slate-600 border border-slate-200/80 mt-0.5">
                          {ipo.category || "Mainboard"}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle size={13} weight="fill" /> Listed
                    </span>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-5 space-y-4 flex-1">
                  {/* METRIC 1 & 2: Number of IPO Allotted & Applicants */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60">
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-400 block mb-0.5 uppercase tracking-wider">
                        IPO Allotted
                      </span>
                      <span className="text-base font-black text-slate-900 num-tabular">
                        {ipo.lotsAllotted} {ipo.lotsAllotted === 1 ? "Lot" : "Lots"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-extrabold text-slate-400 block mb-0.5 uppercase tracking-wider">
                        Applicants
                      </span>
                      <span className="text-base font-black text-slate-900 num-tabular flex items-center gap-1">
                        <Users size={14} className="text-slate-400" />
                        {ipo.applicantsCount}
                      </span>
                    </div>
                  </div>

                  {/* PROFIT METRICS: USER PROFIT (MY PROFIT) + 1 LOT PROFIT + TOTAL PROFIT */}
                  <div className="space-y-2.5 pt-1">
                    {/* USER PROFIT HIGHLIGHT (MY PROFIT) */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-600 font-bold" />
                        <div>
                          <span className="text-xs font-black text-blue-900 block">
                            User Profit ({activeUserName})
                          </span>
                          <span className="text-[10px] font-semibold text-blue-600">
                            Your Allocation
                          </span>
                        </div>
                      </div>
                      <span className="text-base font-black text-blue-700 font-mono num-tabular">
                        +{formatINR(myProfitAmount)}
                      </span>
                    </div>

                    {/* 1 LOT PROFIT */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-emerald-600" />
                        <span className="text-xs font-extrabold text-slate-700">1 Lot Profit</span>
                      </div>
                      <span className="text-sm font-black text-emerald-700 font-mono num-tabular">
                        +{formatINR(ipo.oneLotProfit)}
                      </span>
                    </div>

                    {/* TOTAL PROFIT */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 text-white shadow-xs">
                      <div className="flex items-center gap-2">
                        <TrendUp size={18} className="text-emerald-400" />
                        <span className="text-xs font-bold text-slate-300">Total Profit</span>
                      </div>
                      <span className="text-base font-black text-emerald-400 font-mono num-tabular">
                        +{formatINR(ipo.totalProfit)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER INFO */}
                <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Listed: {ipo.listingDate || "Aug 2026"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
