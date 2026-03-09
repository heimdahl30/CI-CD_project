const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../src/utils/list_helper')


describe('total likes', () => {
  const blogPosts = [
    {
      title: "Pause innovation now and pay the price later.",
      author: "Stephanie",
      url: "https://www.forrester.com/blogs/pause-innovation-now-and-pay-the-price-later-why-ai-readiness-cant-wait/",
      likes: 54,
      id: "6863bb7b3502385c2aea2f10"
    },
    {
      title: "Safeguarding sensitive healthcare data with Oracle Access Governance ",
      author: "Shishir",
      url: "https://blogs.oracle.com/cloud-infrastructure/post/oracle-health-ehr-access-governance",
      likes: 49,
      id: "6863be043502385c2aea2f14"
    },
    {
      title: "AWS backup adds new Multi-party approval for logically air-gapped vaults",
      author: "Veliswa",
      url: "https://aws.amazon.com/blogs/aws/aws-backup-adds-new-multi-party-approval-for-logically-air-gapped-vaults/",
      likes: 45,
      id: "6863c1983502385c2aea2f1a"
    },
    {
      title: "The world needs radical debt transparency",
      author: "Axel",
      url: "https://blogs.worldbank.org/en/voices/the-world-needs-radical-debt-transparency",
      likes: 36,
      id: "68651d9cb38d0a63a77deab6"
    }
  ]

  test('total likes should be', () => {
    const result = listHelper.totalLikes(blogPosts)
    assert.strictEqual(result, 184)
  })
})