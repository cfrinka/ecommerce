export type Locale = 'en' | 'pt-BR';
export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'pt-BR'];

export const dictionary = {
  en: {
    nav: { cart: 'CART', orders: 'ORDERS', admin: 'ADMIN', login: 'LOGIN', logout: 'LOGOUT', signup: 'SIGN UP' },
    home: { collection: 'Collection', allProducts: 'ALL PRODUCTS' },
    product: { backToShop: 'BACK TO SHOP', inStock: 'in stock', size: 'Size', added: 'ADDED', addToCart: 'ADD TO CART' },
    cart: {
      title: 'SHOPPING CART',
      emptyTitle: 'Your cart is empty',
      emptyDesc: 'Add some items to get started.',
      continueShopping: 'CONTINUE SHOPPING',
      size: 'Size',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      shippingAddress: 'Shipping Address',
      addressPlaceholder: 'Enter your full shipping address',
      placeOrder: 'PLACE ORDER',
      placingOrder: 'PLACING ORDER...',
      free: 'Free',
    },
    orders: {
      title: 'YOUR ORDERS',
      noOrders: 'You have not placed any orders yet.',
      startShopping: 'START SHOPPING',
      order: 'Order',
      shippingTo: 'Shipping to',
    },
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your BENE account',
      email: 'Email',
      password: 'Password',
      signIn: 'SIGN IN',
      signingIn: 'SIGNING IN...',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
    },
    signup: {
      title: 'Join BENE',
      subtitle: 'Create your account for exclusive drops',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      createAccount: 'CREATE ACCOUNT',
      creatingAccount: 'CREATING ACCOUNT...',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in',
    },
    carousel: { shopNow: 'SHOP NOW' },
  },
  'pt-BR': {
    nav: { cart: 'CARRINHO', orders: 'PEDIDOS', admin: 'ADMIN', login: 'ENTRAR', logout: 'SAIR', signup: 'CADASTRAR' },
    home: { collection: 'Coleção', allProducts: 'TODOS OS PRODUTOS' },
    product: { backToShop: 'VOLTAR À LOJA', inStock: 'em estoque', size: 'Tamanho', added: 'ADICIONADO', addToCart: 'ADICIONAR AO CARRINHO' },
    cart: {
      title: 'CARRINHO DE COMPRAS',
      emptyTitle: 'Seu carrinho está vazio',
      emptyDesc: 'Adicione alguns itens para começar.',
      continueShopping: 'CONTINUAR COMPRANDO',
      size: 'Tamanho',
      subtotal: 'Subtotal',
      shipping: 'Frete',
      total: 'Total',
      shippingAddress: 'Endereço de Entrega',
      addressPlaceholder: 'Digite seu endereço completo de entrega',
      placeOrder: 'FINALIZAR PEDIDO',
      placingOrder: 'FINALIZANDO...',
      free: 'Grátis',
    },
    orders: {
      title: 'SEUS PEDIDOS',
      noOrders: 'Você ainda não fez nenhum pedido.',
      startShopping: 'COMEÇAR A COMPRAR',
      order: 'Pedido',
      shippingTo: 'Entrega para',
    },
    login: {
      title: 'Bem-vindo de Volta',
      subtitle: 'Entre na sua conta BENE',
      email: 'E-mail',
      password: 'Senha',
      signIn: 'ENTRAR',
      signingIn: 'ENTRANDO...',
      noAccount: 'Não tem uma conta?',
      signUp: 'Cadastre-se',
    },
    signup: {
      title: 'Junte-se à BENE',
      subtitle: 'Crie sua conta para lançamentos exclusivos',
      name: 'Nome',
      email: 'E-mail',
      password: 'Senha',
      createAccount: 'CRIAR CONTA',
      creatingAccount: 'CRIANDO CONTA...',
      haveAccount: 'Já tem uma conta?',
      signIn: 'Entrar',
    },
    carousel: { shopNow: 'COMPRE AGORA' },
  },
};

export function getDictionary(locale: Locale) {
  return dictionary[locale] ?? dictionary[defaultLocale];
}

// Client-side locale reader
export function getClientLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/bene-locale=([^;]+)/);
  if (match?.[1] === 'pt-BR') return 'pt-BR';
  return 'en';
}
