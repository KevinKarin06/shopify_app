import { Card, DataTable, Page, Layout, Spinner, TextContainer, Heading } from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import React, { useState } from 'react';
import axios from 'axios'

const client = axios.create({
  baseURL: 'https://test-case.quable.com/api/',
  headers: {
    'Authorization': `Bearer ${'055CF6DA40695A92B87396DED02638AA8E2A3D14'}`,
    // 'Authorization': `Bearer ${process.env.PIM_TOKEN}`,
  }
});

export default function HomePage() {
  console.log('token', navigator.language);

  const langs = { fr: 'fr_FR', en: 'en_GB' }

  const lang = langs[navigator.language.split('-')[0]] || langs.en

  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  const fetchProducts = () => {
    setLoading(true)
    client.get('/documents').then((response) => {
      setProducts(response.data['hydra:member'].filter(el => el.attributes.product_name != undefined))
    })
      .catch((error) => {
        console.log(error);
        setError(error)
      }).finally(() => {
        setLoading(false)
      })
  }
  React.useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <Page narrowWidth>
      <TitleBar title="Test App1" primaryAction={null} />
      <Layout>
        {loading && <Spinner accessibilityLabel="Spinner example" size="large" />}
        {products && < Card title="Product List" sectioned>
          <DataTable
            columnContentTypes={[
              'text',
              'text',
              'text',
              'numeric',
            ]}
            headings={[
              'Product Name',
              'Title',
              'Model',
              'Net quantity',
            ]}
            rows={products.map(el => {
              const details = el.attributes
              return [details.product_name[lang],
              stripHtml(details.product_metatitle[lang]),
              details.product_model,
              details.product_items_qty || '-'
              ]
            })}
          // rows={rows}
          />
        </Card>}
        {error &&
          <TextContainer spacing="tight">
            <Heading>  Somthing went wrong please refresh</Heading>
          </TextContainer>
        }
      </Layout>
    </Page >
  );
}
