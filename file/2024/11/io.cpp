namespace io {
	const int SIZE = (1 << 25) + 1;
	char ibuf[SIZE], *iS, *iT;
	char obuf[SIZE], *oS = obuf, *oT = oS + SIZE - 1, c, qu[64];
	int f, qr;
	
	#define gc() (iS == iT ? (iT = (iS = ibuf) + fread (ibuf, 1, SIZE, stdin), (iS == iT ? EOF : *iS ++)) : *iS ++)
	
	inline void flush () {
		fwrite (obuf, 1, oS - obuf, stdout);
		oS = obuf;
	}
	inline void putc (char x) {
		*oS ++ = x;
		if (oS == oT) flush ();
	}
	template <class I> inline void IN (I &x) {
		for (f = 1, c = gc(); c < '0' || c > '9'; c = gc()) if (c == '-') f = -1;
		for (x = 0; c <= '9' && c >= '0'; c = gc()) x = x * 10 + (c & 15); 
		x = f == -1 ? -x : x;
	}
	template <class I> inline void print (I x) {
		if (! x) putc ('0'); if (x < 0) putc ('-'), x = -x;
		while (x) qu[ ++ qr] = x % 10 + '0',  x /= 10;
		while (qr) putc (qu[qr -- ]);
	}
	struct Flusher_ {~Flusher_(){flush();}}io_flusher_;
}
using io :: IN;
using io :: putc;
using io :: print;
