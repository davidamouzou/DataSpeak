import { DatabaseSchema } from '../types/suggestions';

/**
 * Schéma de démonstration pour une base de données e-commerce
 */
export const mockEcommerceSchema: DatabaseSchema = {
  tables: [
    {
      name: 'customers',
      rowCount: 1250,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'email', type: 'string' },
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'country', type: 'string' },
        { name: 'registration_date', type: 'date' },
        { name: 'total_orders', type: 'integer' },
        { name: 'lifetime_value', type: 'decimal' },
        { name: 'status', type: 'string' } // 'active', 'inactive', 'vip'
      ]
    },
    {
      name: 'orders',
      rowCount: 5420,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'customer_id', type: 'integer', isForeignKey: true, referencedTable: 'customers' },
        { name: 'order_date', type: 'date' },
        { name: 'total_amount', type: 'decimal' },
        { name: 'status', type: 'string' }, // 'pending', 'shipped', 'delivered', 'cancelled'
        { name: 'shipping_country', type: 'string' },
        { name: 'payment_method', type: 'string' }
      ]
    },
    {
      name: 'products',
      rowCount: 340,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'price', type: 'decimal' },
        { name: 'stock_quantity', type: 'integer' },
        { name: 'supplier', type: 'string' },
        { name: 'created_at', type: 'date' },
        { name: 'is_active', type: 'boolean' }
      ]
    },
    {
      name: 'order_items',
      rowCount: 12850,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'order_id', type: 'integer', isForeignKey: true, referencedTable: 'orders' },
        { name: 'product_id', type: 'integer', isForeignKey: true, referencedTable: 'products' },
        { name: 'quantity', type: 'integer' },
        { name: 'unit_price', type: 'decimal' },
        { name: 'discount', type: 'decimal', isNullable: true }
      ]
    },
    {
      name: 'reviews',
      rowCount: 2340,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'product_id', type: 'integer', isForeignKey: true, referencedTable: 'products' },
        { name: 'customer_id', type: 'integer', isForeignKey: true, referencedTable: 'customers' },
        { name: 'rating', type: 'integer' }, // 1-5
        { name: 'comment', type: 'text', isNullable: true },
        { name: 'created_at', type: 'date' }
      ]
    }
  ],
  relationships: [
    { from: 'customers', to: 'orders', type: 'one-to-many' },
    { from: 'orders', to: 'order_items', type: 'one-to-many' },
    { from: 'products', to: 'order_items', type: 'one-to-many' },
    { from: 'products', to: 'reviews', type: 'one-to-many' },
    { from: 'customers', to: 'reviews', type: 'one-to-many' }
  ]
};

/**
 * Schéma de démonstration pour une base de données RH
 */
export const mockHRSchema: DatabaseSchema = {
  tables: [
    {
      name: 'employees',
      rowCount: 450,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'hire_date', type: 'date' },
        { name: 'department', type: 'string' },
        { name: 'position', type: 'string' },
        { name: 'salary', type: 'decimal' },
        { name: 'manager_id', type: 'integer', isForeignKey: true, referencedTable: 'employees', isNullable: true },
        { name: 'status', type: 'string' } // 'active', 'on_leave', 'terminated'
      ]
    },
    {
      name: 'departments',
      rowCount: 12,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'name', type: 'string' },
        { name: 'budget', type: 'decimal' },
        { name: 'location', type: 'string' },
        { name: 'head_count', type: 'integer' }
      ]
    },
    {
      name: 'time_off_requests',
      rowCount: 2340,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'employee_id', type: 'integer', isForeignKey: true, referencedTable: 'employees' },
        { name: 'start_date', type: 'date' },
        { name: 'end_date', type: 'date' },
        { name: 'type', type: 'string' }, // 'vacation', 'sick', 'personal'
        { name: 'status', type: 'string' }, // 'pending', 'approved', 'rejected'
        { name: 'created_at', type: 'date' }
      ]
    }
  ],
  relationships: [
    { from: 'employees', to: 'time_off_requests', type: 'one-to-many' }
  ]
};

/**
 * Schéma de démonstration pour analytics web
 */
export const mockAnalyticsSchema: DatabaseSchema = {
  tables: [
    {
      name: 'page_views',
      rowCount: 150000,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'session_id', type: 'string' },
        { name: 'user_id', type: 'integer', isNullable: true },
        { name: 'page_url', type: 'string' },
        { name: 'referrer', type: 'string', isNullable: true },
        { name: 'device_type', type: 'string' }, // 'desktop', 'mobile', 'tablet'
        { name: 'browser', type: 'string' },
        { name: 'country', type: 'string' },
        { name: 'timestamp', type: 'datetime' },
        { name: 'time_on_page', type: 'integer' } // seconds
      ]
    },
    {
      name: 'conversions',
      rowCount: 3420,
      columns: [
        { name: 'id', type: 'integer', isPrimaryKey: true },
        { name: 'session_id', type: 'string' },
        { name: 'user_id', type: 'integer', isNullable: true },
        { name: 'conversion_type', type: 'string' }, // 'purchase', 'signup', 'download'
        { name: 'revenue', type: 'decimal', isNullable: true },
        { name: 'timestamp', type: 'datetime' }
      ]
    }
  ],
  relationships: []
};
