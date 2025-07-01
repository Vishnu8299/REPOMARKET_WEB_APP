import { ChevronRight, Home } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export const Breadcrumb = ({
  items,
  showHome = true,
  className = "",
}: BreadcrumbProps) => {
  const navigate = useNavigate();
  const allItems = showHome
    ? [{ label: "Home", href: "/developer", icon: <Home className="w-4 h-4" /> }, ...items]
    : items

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center py-2 ${className}`}
    >
      <ol className="inline-flex items-center">
        {allItems.map((item, index) => (
          <motion.li
            key={`${item.href}-${index}`}
            className="inline-flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            {index === allItems.length - 1 ? (
              <span
                className="flex items-center text-sm font-medium text-gray-500"
                aria-current="page"
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              item.label === "Home" ? (
                <button
                  type="button"
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline bg-transparent border-none p-0 m-0"
                  onClick={() => navigate("/developer")}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  {item.icon && <span className="mr-1.5">{item.icon}</span>}
                  {item.label}
                </button>
              ) : (
                <Link
                  to={item.href}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 
                            transition-colors duration-200 hover:underline"
                >
                  {item.icon && <span className="mr-1.5">{item.icon}</span>}
                  {item.label}
                </Link>
              )
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
