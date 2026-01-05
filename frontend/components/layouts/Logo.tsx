export const Logo = () => {
    return (
        <div className="flex justify-center items-center w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-br from-primary to-chart-3 rounded-lg shadow-sm">
            <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <rect x="60"  y="150" width="40" height="120" rx="20"/>
              <rect x="115" y="110" width="40" height="200" rx="20"/>
              <rect x="170" y="70"  width="40" height="280" rx="20"/>
              <rect x="225" y="130" width="40" height="220" rx="20"/>
              <rect x="280" y="140" width="40" height="200" rx="20"/>
              <rect x="335" y="170" width="30" height="140" rx="15"/>
            </svg>
        </div>
    )
}