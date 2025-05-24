export default function TailwindTest() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-4xl font-bold text-blue-600">Tailwind CSS Test</h1>
      
      {/* Basic utilities */}
      <div className="bg-red-500 text-white p-4 rounded-lg">
        ✅ Basic utilities: bg-red-500, text-white, p-4, rounded-lg
      </div>
      
      {/* Custom colors */}
      <div className="bg-primary-500 text-white p-4 rounded-lg">
        ✅ Custom primary color: bg-primary-500
      </div>
      
      {/* Responsive */}
      <div className="bg-green-500 p-2 md:p-6 lg:p-8 text-white rounded-lg">
        ✅ Responsive: p-2 → md:p-6 → lg:p-8
      </div>
      
      {/* Gradients */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg">
        ✅ Gradients: bg-gradient-to-r from-blue-600 to-purple-600
      </div>
      
      {/* Custom CSS classes */}
      <div className="card-hover glass-morphism p-4">
        ✅ Custom classes: card-hover, glass-morphism
      </div>
      
      {/* Custom animations */}
      <div className="animate-fade-in bg-yellow-400 p-4 rounded-lg">
        ✅ Custom animation: animate-fade-in
      </div>
      
      {/* CSS variables */}
      <div style={{ backgroundColor: 'var(--primary-color)', color: 'white' }} className="p-4 rounded-lg">
        ✅ CSS variables: var(--primary-color)
      </div>
    </div>
  );
} 