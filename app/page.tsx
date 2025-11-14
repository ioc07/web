"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Search } from "lucide-react";
import { Loan, TabType } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  calculateMonthlyInterest,
  calculateTotalInterest,
  calculateTerm,
  getStatusBadgeVariant,
} from "@/lib/calculations";

const initialLoans: Loan[] = [
  {
    id: "L001",
    bank: "Bank A",
    amount: 1000000000,
    rate: 7.5,
    disbursementDate: "2024-01-20",
    maturityDate: "2025-01-15",
    term: 11,
    status: "Active",
    notes: "",
  },
  {
    id: "L002",
    bank: "Bank B",
    amount: 500000000,
    rate: 8.0,
    disbursementDate: "2024-02-15",
    maturityDate: "2025-02-15",
    term: 12,
    status: "Active",
    notes: "",
  },
  {
    id: "L003",
    bank: "Bank C",
    amount: 750000000,
    rate: 7.8,
    disbursementDate: "2024-03-10",
    maturityDate: "2025-03-10",
    term: 12,
    status: "Active",
    notes: "",
  },
  {
    id: "L004",
    bank: "Bank A",
    amount: 300000000,
    rate: 7.2,
    disbursementDate: "2024-04-05",
    maturityDate: "2025-04-05",
    term: 12,
    status: "Active",
    notes: "",
  },
  {
    id: "L005",
    bank: "Bank D",
    amount: 1200000000,
    rate: 8.2,
    disbursementDate: "2024-05-18",
    maturityDate: "2025-05-18",
    term: 12,
    status: "Active",
    notes: "",
  },
];

export default function Home() {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [searchTerm, setSearchTerm] = useState("");
  const [bankFilter, setBankFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("amount");
  const [currentTab, setCurrentTab] = useState<TabType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [paymentDay, setPaymentDay] = useState(25);
  const [yearBasis] = useState(365);

  // Form state
  const [formData, setFormData] = useState<Loan>({
    id: "",
    bank: "",
    amount: 0,
    rate: 0,
    disbursementDate: "",
    maturityDate: "",
    term: 0,
    status: "Active",
    notes: "",
  });

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalLoans = loans.length;
    const activeLoans = loans.filter((l) => l.status === "Active").length;
    const totalAmount = loans.reduce((sum, l) => sum + l.amount, 0);
    const averageRate =
      loans.reduce((sum, l) => sum + l.rate, 0) / loans.length || 0;
    const totalInterest = loans.reduce(
      (sum, l) => sum + calculateTotalInterest(l.amount, l.rate, l.term, yearBasis),
      0
    );
    const monthlyInterest = loans
      .filter((l) => l.status === "Active")
      .reduce(
        (sum, l) => sum + calculateMonthlyInterest(l.amount, l.rate, yearBasis),
        0
      );

    return {
      totalLoans,
      activeLoans,
      totalAmount,
      averageRate,
      totalInterest,
      monthlyInterest,
    };
  }, [loans, yearBasis]);

  // Filter and sort loans
  const filteredLoans = useMemo(() => {
    let filtered = [...loans];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (loan) =>
          loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Bank filter
    if (bankFilter !== "all") {
      filtered = filtered.filter((loan) => loan.bank === bankFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((loan) => loan.status === statusFilter);
    }

    // Tab filter
    if (currentTab !== "all" && currentTab !== "summary") {
      const statusMap = {
        active: "Active",
        paid: "Paid",
        overdue: "Overdue",
      };
      filtered = filtered.filter(
        (loan) => loan.status === statusMap[currentTab as keyof typeof statusMap]
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.amount - a.amount;
        case "rate":
          return b.rate - a.rate;
        case "disbursement":
          return (
            new Date(b.disbursementDate).getTime() -
            new Date(a.disbursementDate).getTime()
          );
        case "interest":
          return (
            calculateTotalInterest(b.amount, b.rate, b.term, yearBasis) -
            calculateTotalInterest(a.amount, a.rate, a.term, yearBasis)
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [loans, searchTerm, bankFilter, statusFilter, currentTab, sortBy, yearBasis]);

  // Calculate bank summary
  const bankSummary = useMemo(() => {
    const banks = ["Bank A", "Bank B", "Bank C", "Bank D", "Bank E"];
    return banks.map((bank) => {
      const bankLoans = loans.filter((l) => l.bank === bank);
      const totalAmount = bankLoans.reduce((sum, l) => sum + l.amount, 0);
      const avgRate =
        bankLoans.length > 0
          ? bankLoans.reduce((sum, l) => sum + l.rate, 0) / bankLoans.length
          : 0;
      const monthlyInterest = bankLoans.reduce(
        (sum, l) => sum + calculateMonthlyInterest(l.amount, l.rate, yearBasis),
        0
      );
      const totalInterest = bankLoans.reduce(
        (sum, l) => sum + calculateTotalInterest(l.amount, l.rate, l.term, yearBasis),
        0
      );

      return {
        bank,
        count: bankLoans.length,
        totalAmount,
        avgRate,
        monthlyInterest,
        totalInterest,
      };
    });
  }, [loans, yearBasis]);

  const handleAddLoan = () => {
    setEditingIndex(-1);
    setFormData({
      id: "",
      bank: "",
      amount: 0,
      rate: 0,
      disbursementDate: "",
      maturityDate: "",
      term: 0,
      status: "Active",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleEditLoan = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...loans[index] });
    setIsModalOpen(true);
  };

  const handleDeleteLoan = (index: number) => {
    if (confirm("Are you sure you want to delete this loan?")) {
      const newLoans = [...loans];
      newLoans.splice(index, 1);
      setLoans(newLoans);
    }
  };

  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const term = calculateTerm(formData.disbursementDate, formData.maturityDate);
    const loanData = { ...formData, term };

    if (editingIndex >= 0) {
      const newLoans = [...loans];
      newLoans[editingIndex] = loanData;
      setLoans(newLoans);
    } else {
      setLoans([...loans, loanData]);
    }

    setIsModalOpen(false);
  };

  const handleExport = () => {
    const headers = [
      "Loan ID",
      "Bank",
      "Amount",
      "Rate",
      "Disbursement",
      "Maturity",
      "Term",
      "Status",
    ];
    const rows = loans.map((loan) => [
      loan.id,
      loan.bank,
      loan.amount,
      loan.rate,
      loan.disbursementDate,
      loan.maturityDate,
      loan.term,
      loan.status,
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loans_export.csv";
    a.click();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
            💰 Loan Interest Manager
          </h1>
          <p className="text-gray-600 text-lg">Multi-Bank Loan Portfolio Dashboard</p>
        </div>

        {/* Settings Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>⚙️ Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <Label htmlFor="paymentDay" className="min-w-[180px]">
                Interest Payment Day:
              </Label>
              <Input
                id="paymentDay"
                type="number"
                min="1"
                max="28"
                value={paymentDay}
                onChange={(e) => setPaymentDay(Number(e.target.value))}
                className="w-24"
              />
              <Label className="min-w-[120px] md:ml-4">
                Year Days Basis: {yearBasis}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Loans
              </CardTitle>
              <span className="text-2xl">📊</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statistics.totalLoans}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Loans
              </CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {statistics.activeLoans}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Amount
              </CardTitle>
              <span className="text-2xl">💵</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(statistics.totalAmount)}{" "}
                <span className="text-sm text-gray-500">VND</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Rate
              </CardTitle>
              <span className="text-2xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {statistics.averageRate.toFixed(2)}{" "}
                <span className="text-sm text-gray-500">%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Interest
              </CardTitle>
              <span className="text-2xl">💸</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {formatCurrency(statistics.totalInterest)}{" "}
                <span className="text-sm text-gray-500">VND</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                This Month Interest
              </CardTitle>
              <span className="text-2xl">📅</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {formatCurrency(statistics.monthlyInterest)}{" "}
                <span className="text-sm text-gray-500">VND</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="🔍 Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={bankFilter} onValueChange={setBankFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Banks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Banks</SelectItem>
              <SelectItem value="Bank A">Bank A</SelectItem>
              <SelectItem value="Bank B">Bank B</SelectItem>
              <SelectItem value="Bank C">Bank C</SelectItem>
              <SelectItem value="Bank D">Bank D</SelectItem>
              <SelectItem value="Bank E">Bank E</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amount">Sort by Amount</SelectItem>
              <SelectItem value="rate">Sort by Rate</SelectItem>
              <SelectItem value="disbursement">Sort by Date</SelectItem>
              <SelectItem value="interest">Sort by Interest</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleAddLoan}>
              <Plus className="h-4 w-4 mr-2" />
              Add Loan
            </Button>
          </div>
        </div>

        {/* Tabs and Table */}
        <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as TabType)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All Loans <Badge className="ml-2">{loans.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active{" "}
              <Badge className="ml-2">
                {loans.filter((l) => l.status === "Active").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="paid">
              Paid{" "}
              <Badge className="ml-2">
                {loans.filter((l) => l.status === "Paid").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue{" "}
              <Badge className="ml-2">
                {loans.filter((l) => l.status === "Overdue").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="summary">Bank Summary</TabsTrigger>
          </TabsList>

          <TabsContent value={currentTab} className="mt-0">
            {currentTab === "summary" ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank</TableHead>
                      <TableHead>Total Loans</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Average Rate</TableHead>
                      <TableHead>Monthly Interest</TableHead>
                      <TableHead>Total Interest</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankSummary.map((summary) => (
                      <TableRow key={summary.bank}>
                        <TableCell>
                          <Badge variant="secondary">{summary.bank}</Badge>
                        </TableCell>
                        <TableCell>{summary.count}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(summary.totalAmount)} VND
                        </TableCell>
                        <TableCell className="text-purple-600 font-semibold">
                          {summary.avgRate.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-red-500 font-semibold">
                          {formatCurrency(summary.monthlyInterest)}
                        </TableCell>
                        <TableCell className="text-red-500 font-semibold">
                          {formatCurrency(summary.totalInterest)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-gray-50">
                      <TableCell>TOTAL</TableCell>
                      <TableCell>{loans.length}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(statistics.totalAmount)} VND
                      </TableCell>
                      <TableCell className="text-purple-600 font-semibold">
                        {statistics.averageRate.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-red-500 font-semibold">
                        {formatCurrency(statistics.monthlyInterest)}
                      </TableCell>
                      <TableCell className="text-red-500 font-semibold">
                        {formatCurrency(statistics.totalInterest)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Disbursement</TableHead>
                      <TableHead>Maturity</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Monthly Interest</TableHead>
                      <TableHead>Total Interest</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLoans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-12">
                          <div className="text-gray-400">
                            <h3 className="text-lg font-semibold mb-2">
                              No loans found
                            </h3>
                            <p className="text-sm">Create a new loan to get started</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLoans.map((loan, index) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-semibold text-purple-600">
                            {loan.id}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{loan.bank}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(loan.amount)} VND
                          </TableCell>
                          <TableCell className="text-purple-600 font-semibold">
                            {loan.rate}%
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {formatDate(loan.disbursementDate)}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {formatDate(loan.maturityDate)}
                          </TableCell>
                          <TableCell>{loan.term}M</TableCell>
                          <TableCell className="text-red-500 font-semibold">
                            {formatCurrency(
                              calculateMonthlyInterest(loan.amount, loan.rate, yearBasis)
                            )}
                          </TableCell>
                          <TableCell className="text-red-500 font-semibold">
                            {formatCurrency(
                              calculateTotalInterest(
                                loan.amount,
                                loan.rate,
                                loan.term,
                                yearBasis
                              )
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(loan.status)}>
                              {loan.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditLoan(loans.indexOf(loan))
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleDeleteLoan(loans.indexOf(loan))
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndex >= 0 ? "Edit Loan" : "Add New Loan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveLoan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanId">Loan ID</Label>
                <Input
                  id="loanId"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="loanBank">Bank</Label>
                <Select
                  value={formData.bank}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bank: value })
                  }
                >
                  <SelectTrigger id="loanBank">
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank A">Bank A</SelectItem>
                    <SelectItem value="Bank B">Bank B</SelectItem>
                    <SelectItem value="Bank C">Bank C</SelectItem>
                    <SelectItem value="Bank D">Bank D</SelectItem>
                    <SelectItem value="Bank E">Bank E</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="loanAmount">Loan Amount (VND)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="loanRate">Interest Rate (%)</Label>
                <Input
                  id="loanRate"
                  type="number"
                  step="0.1"
                  value={formData.rate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, rate: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="disbursementDate">Disbursement Date</Label>
                <Input
                  id="disbursementDate"
                  type="date"
                  value={formData.disbursementDate}
                  onChange={(e) =>
                    setFormData({ ...formData, disbursementDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="maturityDate">Maturity Date</Label>
                <Input
                  id="maturityDate"
                  type="date"
                  value={formData.maturityDate}
                  onChange={(e) =>
                    setFormData({ ...formData, maturityDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="loanStatus">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="loanStatus">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="loanNotes">Notes</Label>
                <Input
                  id="loanNotes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
