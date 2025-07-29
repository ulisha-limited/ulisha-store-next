import {
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  Users,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Ulisha Store
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your premier destination for quality fashion, accessories, and
            electronics. We bring you the best products at competitive prices,
            with both fiat and cryptocurrency payment options.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600">
                To provide our customers with high-quality, affordable products
                while ensuring a seamless shopping experience. We strive to make
                online shopping accessible to everyone by offering multiple
                payment options and excellent customer service.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600">
                To become Nigeria&apos;s most trusted e-commerce platform, known for
                our quality products, reliable service, and innovative payment
                solutions. We aim to revolutionize the online shopping
                experience in Africa.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-orange-500 mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Secure Shopping
            </h3>
            <p className="text-gray-600">
              Your security is our priority. We use industry-standard encryption
              to protect your personal and payment information.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-orange-500 mb-4">
              <CreditCard className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Multiple Payment Options
            </h3>
            <p className="text-gray-600">
              Choose from various payment methods including credit cards, bank
              transfers, and cryptocurrencies.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-orange-500 mb-4">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              We partner with reliable logistics companies to ensure your orders
              reach you quickly and safely.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Ulisha Store?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-500/10 rounded-full p-4 inline-block mb-4">
                <ShoppingBag className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quality Products
              </h3>
              <p className="text-sm text-gray-600">
                Carefully curated selection of high-quality items
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500/10 rounded-full p-4 inline-block mb-4">
                <CreditCard className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-sm text-gray-600">
                Multiple secure payment options available
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500/10 rounded-full p-4 inline-block mb-4">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Customer Support
              </h3>
              <p className="text-sm text-gray-600">
                Dedicated team ready to assist you
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500/10 rounded-full p-4 inline-block mb-4">
                <Truck className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Fast Shipping
              </h3>
              <p className="text-sm text-gray-600">
                Quick and reliable delivery service
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+234 (0) 706 043 8205</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">support@ulishastore.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Address</h3>
                <p className="text-gray-600">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
