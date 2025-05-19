export function NewsletterCard() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-4 p-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-2xl">Subscribe to our newsletter</h3>
          <p className="text-sm text-muted-foreground">
            Get notified about the latest blog posts, updates, and exclusive content directly in your inbox.
          </p>
        </div>
        <form className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 text-sm border rounded-md"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
} 