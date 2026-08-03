import Image from "next/image";
import Link from "next/link";

export default function Logo({ href = "/dashboard" }: { href?: string }) {
    return (
        <Link href={href} className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm" aria-label="CareerTrack Home">
            <Image
                src="/images/logov2.png"
                alt="CareerTrack"
                width={130}
                height={32}
                className="object-contain"
                style={{ height: "auto" }}
                priority
            />
        </Link>
    );
}
