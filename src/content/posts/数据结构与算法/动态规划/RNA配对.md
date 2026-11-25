---
title: 文章标题
description: 文章摘要
date: 2026-11-25
category: "数据结构与算法"
tags: []
draft: false
---
# 第二结构问题
## 规则
<A,C,G,U>   
A对U，G对C。单链成环。
- 一个序列满足匹配集合：$S{(b_i,b_j)}$,只有(A,U)(U,A)(C,G)(G,C)这四种情况
- 没有短拐角，S的每一个对之间至少插入四个其它元素，$j-i \ge 4  \quad \text{for} (b_i,b_j)\in S$
- 无交叉，对$(b_i,b_j)(b_k,b_l)$没有$i < k < j < l$
## 例子
$OPT(i,j)$表示从$\{b_i,b_{i+1},\cdots, b_j\}$的配对个数
1. case1   $j-i <4$短拐角，$OTP(i,j)=0$
2. case2   $b_j$不包含在一个配对，$OTP(i,j)=OTP(i,j-1)$
3. case3   $b_t$与$b_j$配对其中$i < t< j-4$, $OTP=1+\max {OPT(i,t-1),OTP(t+1,j)}$
## 复杂度