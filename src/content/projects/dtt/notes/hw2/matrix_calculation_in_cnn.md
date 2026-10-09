# Matrix Calculation in CNN
Sep 28, 2026
## Input and Parameter Shapes
$$
X \in \mathbb{R}^{N \times C_{\mathrm{in}} \times H \times W}
$$
$$
\Theta \in
\mathbb{R}^{C_{\mathrm{out}} \times C_{\mathrm{in}} \times K_H \times K_W}
$$
$$
Y \in
\mathbb{R}^{N \times C_{\mathrm{out}} \times O_H \times O_W}
$$
## The 7 Layer Loop in Naive 2D CNN
In the naive implementation of 2D CNN forward, we need to travel in the order of:  
`batch -> output_channel -> output_height -> output_width -> input_channel -> kernel_height -> kernel_width`
In which the first 4 loops represents each position in the output matrix while the last 3 loops represents the scanning in the input matrix. Whose formula is,  
Let $\widetilde{X}$ be the zero-padded input, then:
$$
Y_{n,o,h_o,w_o}
=
b_o
+
\sum_{i=0}^{C_{\mathrm{in}}-1}
\sum_{k_h=0}^{K_H-1}
\sum_{k_w=0}^{K_W-1}
\widetilde{X}_{
    n,i,
    h_o S_H + k_h D_H,
    w_o S_W + k_w D_W
}
\Theta_{o,i,k_h,k_w}
$$
which looks terrible BTW.
## Identify the Matrix Multiplication Structure
As we learnt from linear algebra, matrix multiplication computes: 
$$
C_{r,c}
=
\sum_{k=0}^{K-1} A_{r,k} B_{k,c}
$$
We can notice that in this formula, tow factors (`r` and `c`) share one sum index `k`. In the naive cnn forward formula, there are three sum indexes:  
$$i, k_{h}, k_{w}$$
And they appear in both input and weight, so we can treat them as one tuple:
$$k \longleftrightarrow (i, k_h, k_w)$$
This could identify which elements are used in the dot product.
No matter how complex the CNN forward is, its still a matrix multiplication:
| Factor | Tensor shape | Output indices it depends on | Summation indices it depends on |
|---|---|---|---|
| Input window element from $\widetilde{X}$ | $(N, C_{\mathrm{in}}, H + 2P_H, W + 2P_W)$ | $h_o, w_o$: which window | $i, k_h, k_w$: which element within the window |
| Kernel element from $\Theta$ | $(C_{\mathrm{out}}, C_{\mathrm{in}}, K_H, K_W)$ | $o$: which kernel | $i, k_h, k_w$: which element within the kernel |
This table could match the basic meaning of matrix multiplication perfectly:
A[r, k]: which window? which element in the window?
B[k, c]: which element in the kernel? which kernel?
So:
$$\boxed{r \longleftrightarrow (h_o, w_o)}$$
$$\boxed{c \longleftrightarrow o}$$

### Map the Correspondence Back to the Convolution Formula

Fix the batch index $n$. The shared summation index $k$ corresponds to
$(i, k_h, k_w)$, the row index $r$ corresponds to $(h_o, w_o)$, and the
column index $c$ corresponds to $o$. These correspondences identify the two
factors in the convolution sum:

$$
Y_{n,o,h_o,w_o} - b_o
=
\underbrace{
    \sum_{i=0}^{C_{\mathrm{in}}-1}
    \sum_{k_h=0}^{K_H-1}
    \sum_{k_w=0}^{K_W-1}
}_{\text{shared summation index } k}
\underbrace{
    \widetilde{X}_{
        n,i,
        h_o S_H + k_h D_H,
        w_o S_W + k_w D_W
    }
}_{A_{r,k}}
\underbrace{
    \Theta_{o,i,k_h,k_w}
}_{B_{k,c}}
$$

With $K = C_{\mathrm{in}} K_H K_W$, the convolution sum matches the
matrix multiplication template:

$$
Y_{n,o,h_o,w_o} - b_o
\longleftrightarrow
C_{r,c}
=
\sum_{k=0}^{K-1} A_{r,k} B_{k,c}
$$

Each input window forms a row of $A$, and each kernel forms a column of $B$.
The batch index $n$ selects an independent matrix multiplication, and the
bias is added afterward. The next step is to assign integer indices to the
grouped coordinates and arrange the sampled input values using im2col.
## Abstraction for Linear Algebra Solution
### Key Idea: Grouping
The key idea for solving this problem elegantly is **grouping**, which means involving multiple indexes to a group and treat them as one. 
| Group | Indices it contains | Meaning |
|---|---|---|
| $k$ | $(i, k_h, k_w)$ | One element within an input window or kernel |
| $\ell$ | $(h_o, w_o)$ | One output window |
| $o$ | Output channel index | One kernel |
Using these grouped indices, the convolution can be written as:
$$
Z_{n,\ell,o}
=
b_o
+
\sum_{k=0}^{K-1}
\underbrace{A_{n,\ell,k}}_{\text{input window element}}
\underbrace{B_{k,o}}_{\text{kernel element}}
$$
Then we can group indices by their roles in the computation then expose the matrix multiplication structure through a consistent re-indexing.