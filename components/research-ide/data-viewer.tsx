"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Filter,
  Download,
  BarChart3,
  TrendingUp,
  Database,
  FileSpreadsheet,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface DataViewerProps {
  fileName?: string
  onGenerateCode?: (code: string) => void
  data?: any[]
}

// Hook to load data from the uploaded dataset
function useDataset(fileName: string | undefined, providedData?: any[]) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (providedData && providedData.length > 0) {
      setData(providedData)
      setLoading(false)
      setError(null)
      return
    }

    if (!fileName) {
      setData([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    // In a real implementation, this would load data from your file system or API
    // For now, we'll just show an empty state
    setTimeout(() => {
      setData([])
      setLoading(false)
      setError(null)
    }, 100)
  }, [fileName, providedData])

  return { data, loading, error }
}

export function DataViewer({ fileName, onGenerateCode, data: providedData }: DataViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const { data: mushroomData, loading, error } = useDataset(fileName, providedData)

  // Get column names
  const columns = useMemo(() => {
    if (mushroomData.length === 0) return []
    return Object.keys(mushroomData[0]).filter(key => key !== 'id')
  }, [mushroomData])

  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!mushroomData.length) return []

    let filtered = mushroomData.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn as keyof typeof a]
        const bVal = b[sortColumn as keyof typeof b]

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }

        const aStr = aVal.toString()
        const bStr = bVal.toString()
        return sortDirection === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr)
      })
    }

    return filtered
  }, [mushroomData, searchTerm, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-card border border-border rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-full bg-card border border-border rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-2">Error loading data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show empty state
  if (!mushroomData.length) {
    return (
      <div className="flex flex-col h-full bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                {fileName || "No dataset selected"}
              </h3>
              <p className="text-sm text-muted-foreground">
                No data available
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {fileName ? "No data found in this file" : "Select a dataset to view data"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const generateAnalysisCode = (type: 'summary' | 'visualization' | 'model') => {
    const selectedColumns = selectedRows.length > 0
      ? columns.filter((_, index) => selectedRows.includes(index))
      : columns

    let code = ""

    switch (type) {
      case 'summary':
        code = `# Data Summary Analysis
import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv('${fileName || 'mushroom_cultivation_data.csv'}')

print("Dataset Overview:")
print(f"Shape: {df.shape}")
print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.1f} MB")

print("\\nColumn Types:")
print(df.dtypes)

print("\\nStatistical Summary:")
print(df.describe())

print("\\nMissing Values:")
print(df.isnull().sum())

# Species distribution
print("\\nSpecies Distribution:")
print(df['species'].value_counts())

# Substrate analysis
print("\\nSubstrate Performance:")
substrate_analysis = df.groupby('substrate').agg({
    'yield_wet_g': ['mean', 'std', 'count'],
    'contamination_rate': 'mean'
}).round(2)
print(substrate_analysis)`
        break

      case 'visualization':
        code = `# Data Visualization
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load and prepare data
df = pd.read_csv('${fileName || 'mushroom_cultivation_data.csv'}')

# Set up the plotting style
plt.style.use('default')
sns.set_palette("husl")

# Create subplots
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('🍄 Mushroom Cultivation Analysis Dashboard', fontsize=16, fontweight='bold')

# 1. Yield by Species
df.groupby('species')['yield_wet_g'].mean().plot(kind='bar', ax=axes[0,0])
axes[0,0].set_title('Average Wet Yield by Species')
axes[0,0].set_ylabel('Yield (g)')
axes[0,0].tick_params(axis='x', rotation=45)

# 2. Temperature vs Humidity scatter
scatter = axes[0,1].scatter(df['temperature_avg'], df['humidity_avg'],
                           c=df['yield_wet_g'], cmap='viridis', alpha=0.6)
axes[0,1].set_xlabel('Temperature (°F)')
axes[0,1].set_ylabel('Humidity (%)')
axes[0,1].set_title('Temperature vs Humidity (colored by yield)')
plt.colorbar(scatter, ax=axes[0,1])

# 3. Contamination rate by substrate
df.groupby('substrate')['contamination_rate'].mean().plot(kind='barh', ax=axes[1,0])
axes[1,0].set_title('Contamination Rate by Substrate')
axes[1,0].set_xlabel('Contamination Rate')

# 4. Yield distribution
axes[1,1].hist(df['yield_wet_g'], bins=30, alpha=0.7, edgecolor='black')
axes[1,1].set_xlabel('Wet Yield (g)')
axes[1,1].set_ylabel('Frequency')
axes[1,1].set_title('Yield Distribution')

plt.tight_layout()
plt.show()

# Save the plot
plt.savefig('mushroom_analysis_dashboard.png', dpi=300, bbox_inches='tight')
print("📊 Dashboard saved as: mushroom_analysis_dashboard.png")`
        break

      case 'model':
        code = `# Machine Learning Model
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib

# Load and prepare data
df = pd.read_csv('${fileName || 'mushroom_cultivation_data.csv'}')

print("🤖 Building Mushroom Yield Prediction Model")
print("=" * 50)

# Encode categorical variables
le_species = LabelEncoder()
le_substrate = LabelEncoder()

df['species_encoded'] = le_species.fit_transform(df['species'])
df['substrate_encoded'] = le_substrate.fit_transform(df['substrate'])

# Feature selection
features = ['species_encoded', 'substrate_encoded', 'temperature_avg',
           'humidity_avg', 'co2_level', 'ph_level', 'moisture_content']
target = 'yield_wet_g'

X = df[features]
y = df[target]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Training samples: {len(X_train):,}")
print(f"Testing samples: {len(X_test):,}")

# Train the model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
    max_depth=10,
    min_samples_split=5
)

model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\\nModel Performance:")
print(f"R² Score: {r2:.3f}")
print(f"RMSE: {np.sqrt(mse):.1f}g")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\\nFeature Importance:")
for idx, row in feature_importance.iterrows():
    print(f"{row['feature']}: {row['importance']:.3f}")

# Save the model
joblib.dump(model, 'mushroom_yield_predictor.pkl')
joblib.dump(le_species, 'species_encoder.pkl')
joblib.dump(le_substrate, 'substrate_encoder.pkl')

print(f"\\n✅ Model saved successfully!")
print(f"📁 Files: mushroom_yield_predictor.pkl, species_encoder.pkl, substrate_encoder.pkl")`
        break
    }

    onGenerateCode?.(code)
  }

  const formatValue = (value: any, column: string) => {
    if (typeof value === 'number') {
      if (column.includes('temperature')) return `${value.toFixed(1)}°F`
      if (column.includes('humidity')) return `${value.toFixed(1)}%`
      if (column.includes('rate')) return `${(value * 100).toFixed(1)}%`
      if (column.includes('yield')) return `${value.toFixed(1)}g`
      if (column.includes('content')) return `${(value * 100).toFixed(1)}%`
      if (column.includes('level') && !column.includes('co2')) return value.toFixed(1)
      return value.toLocaleString()
    }
    return value
  }

  const getColumnType = (column: string) => {
    const sample = mushroomData[0]?.[column as keyof typeof sample]
    if (typeof sample === 'number') return 'numeric'
    if (column.includes('date')) return 'date'
    return 'text'
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">
              {fileName || "mushroom_cultivation_data.csv"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredData.length.toLocaleString()} rows × {columns.length} columns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateAnalysisCode('summary')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Summary
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateAnalysisCode('visualization')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Visualize
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateAnalysisCode('model')}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Train Model
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 rows</SelectItem>
            <SelectItem value="25">25 rows</SelectItem>
            <SelectItem value="50">50 rows</SelectItem>
            <SelectItem value="100">100 rows</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="secondary">
          Page {currentPage} of {totalPages}
        </Badge>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={column}
                  className="cursor-pointer hover:bg-accent/50 select-none"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span className="capitalize">
                      {column.replace(/_/g, ' ')}
                    </span>
                    <div className="flex flex-col">
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getColumnType(column)}
                    </Badge>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={row.id}
                className={selectedRows.includes(index) ? "bg-accent/50" : ""}
              >
                {columns.map((column) => (
                  <TableCell key={column} className="font-mono text-sm">
                    {formatValue(row[column as keyof typeof row], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
          {filteredData.length.toLocaleString()} entries
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}