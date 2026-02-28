> [题目传送门](https://www.luogu.com.cn/problem/P10779)
>
> [广义串并联图](https://www.cnblogs.com/TH911/p/-/Generalized-Series-Parallel-Graph)

# 题意分析

其实是一个仙人掌，但同样属于广义串并联图。考虑仙人掌太难写了~~懒得学~~，因此考虑广义串并联图的方法求解。

设 $f_{e=(u,v),0/1,0/1}$ 表示边 $e=(u,v)$，$u$ 选/不选，$v$ 选/不选的对应子图的最大独立集，实际维护中需要注意 $f_{(u,v),i,j}=f_{(v,u),j,i}$。

考虑删一度点不好维护，设 $g_{x,0/1}$ 表示当前选/不选点 $x$ 且不考虑边，对于独立集的贡献。

* 删一度点，设边为 $(x,v)$，有：

  $$
  g_{v,i}\leftarrow g_{v,i}+\max\left(g_{x,0}+f_{(x,v),0,i},g_{x,1}+f_{(x,v),1,i}\right)
  $$

* 缩二度点，设 $(x,u),(x,v)$ 缩为 $(u,v)$，有：

  $$
  f_{(u,v),i,j}=\max\left(f_{(x,u),0,i}+f_{(x,v),0,j}+g_{x,0},f_{(x,u),1,i}+f_{(x,v),1,j}+g_{x,1}\right)
  $$

* 叠合重边，设 $e_1,e_2$ 叠合为 $e$。

  这个比较简单：

  $$
  f_{e,i,j}=f_{e_1,i,j}+f_{e_2,i,j}
  $$

初始时，由定义可知 $g_{x,0}=0,g_{x,1}=1$，$f_{e,0,0}=f_{e,0,1}=f_{e,1,0}=0,f_{e,1,1}=-\infty$。

取 $-\infty$ 可以避免转移过程中对于一条边两个端点都取的特判。

时间复杂度 $\mathcal O(n)$。

# AC 代码

```cpp
//#include<bits/stdc++.h>
#include<algorithm>
#include<iostream>
#include<cstring>
#include<iomanip>
#include<cstdio>
#include<string>
#include<vector>
#include<cmath>
#include<ctime>
#include<deque>
#include<queue>
#include<stack>
#include<list>
#include<array>
#include<unordered_map>
using namespace std;
typedef array<array<int,2>,2> value;
constexpr const int N=5e4,inf=0x3f3f3f3f;
int n,g[N+1][2];
unordered_map<int,value>f[N+1];
value twist(value a,value b){
	for(int i=0;i<=1;i++){
		for(int j=0;j<=1;j++){
			if(a[i][j]==-inf||b[i][j]==-inf){
				a[i][j]=-inf;
			}else{
				a[i][j]+=b[i][j];
			}
		}
	}
	return a;
}
value inv(value a){
	return {a[0][0],a[1][0],a[0][1],a[1][1]};
}
int main(){
	/*freopen("test.in","r",stdin);
	freopen("test.out","w",stdout);*/
	
	ios::sync_with_stdio(false);
	cin.tie(0);cout.tie(0);
	
	int m;
	cin>>n>>m;
	while(m--){
		int u,v;
		cin>>u>>v;
		if(f[u].count(v)){
			f[v][u]=inv(f[u][v]=twist(f[u][v],{0,0,0,-inf}));
		}else{
			f[v][u]=inv(f[u][v]={0,0,0,-inf});
		}
	}
	queue<int>q;
	for(int i=1;i<=n;i++){
		if(f[i].size()<=2){
			q.push(i);
		}
		g[i][1]=1;
	}
	int lst=0;
	while(q.size()){
		int x=q.front();q.pop();
		if(f[x].size()==1){
			auto [v,e]=*f[x].begin();
			for(int i=0;i<=1;i++){
				g[v][i]+=max(g[x][0]+e[0][i],g[x][1]+e[1][i]);
			}
			f[v].erase(x);
			if(f[v].size()<=2){
				q.push(v);
			}
		}else if(f[x].size()==2){
			auto [u,e1]=*f[x].begin();
			auto [v,e2]=*next(f[x].begin());
			value e;
			for(int i=0;i<=1;i++){
				for(int j=0;j<=1;j++){
					e[i][j]=max(e1[0][i]+e2[0][j]+g[x][0],e1[1][i]+e2[1][j]+g[x][1]);
				}
			}
			if(f[u].count(v)){
				f[v][u]=inv(f[u][v]=twist(f[u][v],e));
			}else{
				f[v][u]=inv(f[u][v]=e);
			}
			f[u].erase(x);
			f[v].erase(x);
			if(f[u].size()<=2){
				q.push(u);
			}
			if(f[v].size()<=2){
				q.push(v);
			}
		}
		f[x].clear();
		lst=x;
	}
	cout<<max(g[lst][0],g[lst][1])<<'\n';
	
	cout.flush();
	
	/*fclose(stdin);
	fclose(stdout);*/
	return 0;
}
```

