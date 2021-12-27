var documenterSearchIndex = {"docs":
[{"location":"api/#API","page":"API","title":"API","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"","category":"page"},{"location":"api/","page":"API","title":"API","text":"Modules = [GRAPE]","category":"page"},{"location":"api/#GRAPE.GrapeResult","page":"API","title":"GRAPE.GrapeResult","text":"Result object returned by optimize_grape.\n\n\n\n\n\n","category":"type"},{"location":"api/#GRAPE.optimize_grape-Tuple{Any}","page":"API","title":"GRAPE.optimize_grape","text":"Optimize the control problem using GRAPE.\n\nresult = optimize_grape(problem; kwargs...)\n\noptimizes the given control problem, see QuantumControlBase.ControlProblem.\n\nKeyword arguments that control the optimization are taken from the keyword arguments used in the instantiation of problem. Any kwargs passed directly to optimize_grape will update (overwrite) the parameters in problem.\n\nRequired problem keyword arguments\n\nJ_T: A function J_T(ϕ, objectives, τ=τ) that evaluates the final time functional from a list ϕ of forward-propagated states and problem.objectives.\ngradient:  A function gradient!(G, τ, ∇τ) that stores the gradient of J_T in G.\n\nOptional problem keyword arguments\n\nupdate_hook\ninfo_hook\ncheck_convergence\nx_tol\nf_tol\ng_tol\nshow_trace\nextended_trace\nshow_every\nallow_f_increases\noptimizer\nprop_method/fw_prop_method/bw_prop_method: The propagation method to use for each objective, see below.\nprop_method/fw_prop_method/grad_prop_method: The propagation method to use for the extended gradient vector for each objective, see below.\n\nThe propagation method for the forward propagation of each objective is determined by the first available item of the following:\n\na fw_prop_method keyword argument\na prop_method keyword argument\na property fw_prop_method of the objective\na property prop_method of the objective\nthe value :auto\n\nThe propagation method for the backword propagation is determined similarly, but with bw_prop_method instead of fw_prop_method. The propagation method for the forward propagation of the extended gradient vector for each objective is determined from grad_prop_method, fw_prop_method, prop_method in order of precedence.\n\n\n\n\n\n","category":"method"},{"location":"api/#GRAPE.print_table-Tuple{Any, Optim.OptimizationState, Optim.AbstractOptimizerState, Any, Vararg{Any}}","page":"API","title":"GRAPE.print_table","text":"Print optimization progress as a table.\n\nThis functions serves as the default info_hook for an optimization with GRAPE.\n\n\n\n\n\n","category":"method"},{"location":"api/#QuantumControlBase.optimize-Tuple{Any, Val{:grape}}","page":"API","title":"QuantumControlBase.optimize","text":"opt_result = optimize(problem; method=:grape, kwargs...)\n\noptimizes problem using GRadident Ascent Pulse Engineering (GRAPE), see GRAPE.optimize_grape.\n\n\n\n\n\n","category":"method"},{"location":"overview/#Overview","page":"Overview","title":"Overview","text":"","category":"section"},{"location":"examples/#Examples","page":"List of Examples","title":"Examples","text":"","category":"section"},{"location":"examples/","page":"List of Examples","title":"List of Examples","text":"Pages = [\n    \"simple_state_to_state.md\",\n]\nDepth = 1","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"EditURL = \"https://github.com/JuliaQuantumControl/GRAPE.jl/blob/master/examples/simple_state_to_state.jl\"","category":"page"},{"location":"examples/simple_state_to_state/#Example-1:-Optimization-of-a-State-to-State-Transfer-in-a-Two-Level-System","page":"Example 1 (TLS)","title":"Example 1: Optimization of a State-to-State Transfer in a Two-Level-System","text":"","category":"section"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"tip: Tip\nThis example is also available as a Jupyter notebook: simple_state_to_state.ipynb.Compare this example against the same example using the krotov Python package.","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"gdefop1hat1 gdefinittextinit gdeftgttexttgt","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"This first example illustrates the basic use of the Krotov.jl by solving a simple canonical optimization problem: the transfer of population in a two level system.","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"using Printf\nusing QuantumControl\nusing LinearAlgebra\nusing Optim\nusing GRAPE # XXX\nusing QuantumControlBase: chain_infohooks\nusing GRAPELinesearchAnalysis\nusing LineSearches\nusing PyPlot: matplotlib\nmatplotlib.use(\"Agg\")","category":"page"},{"location":"examples/simple_state_to_state/#Two-level-Hamiltonian","page":"Example 1 (TLS)","title":"Two-level Hamiltonian","text":"","category":"section"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"We consider the Hamiltonian opH_0 = - fracomega2 opsigma_z, representing a simple qubit with energy level splitting omega in the basis ket0ket1. The control field epsilon(t) is assumed to couple via the Hamiltonian opH_1(t) = epsilon(t) opsigma_x to the qubit, i.e., the control field effectively drives transitions between both qubit states.","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"We we will use","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"ϵ(t) = 0.2 * QuantumControl.shapes.flattop(t, T = 5, t_rise = 0.3, func = :blackman);\nnothing #hide","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"\"\"\"Two-level-system Hamiltonian.\"\"\"\nfunction hamiltonian(Ω = 1.0, ϵ = ϵ)\n    σ̂_z = ComplexF64[1 0; 0 -1]\n    σ̂_x = ComplexF64[0 1; 1 0]\n    Ĥ₀ = -0.5 * Ω * σ̂_z\n    Ĥ₁ = σ̂_x\n    return (Ĥ₀, (Ĥ₁, ϵ))\nend;\nnothing #hide","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"H = hamiltonian();\nnothing #hide","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"The control field here switches on from zero at t=0 to it's maximum amplitude 0.2 within the time period 0.3 (the switch-on shape is half a Blackman pulse). It switches off again in the time period 0.3 before the final time T=5). We use a time grid with 500 time steps between 0 and T:","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"tlist = collect(range(0, 5, length = 500));\nnothing #hide","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"function plot_control(pulse::Vector, tlist)\n    fig, ax = matplotlib.pyplot.subplots(figsize = (6, 3))\n    ax.plot(tlist, pulse)\n    ax.set_xlabel(\"time\")\n    ax.set_ylabel(\"amplitude\")\n    return fig\nend\n\nplot_control(ϵ::T, tlist) where {T<:Function} = plot_control([ϵ(t) for t in tlist], tlist)\n\nplot_control(H[2][2], tlist)","category":"page"},{"location":"examples/simple_state_to_state/#Optimization-target","page":"Example 1 (TLS)","title":"Optimization target","text":"","category":"section"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"The krotov package requires the goal of the optimization to be described by a list of Objective instances. In this example, there is only a single objective: the state-to-state transfer from initial state ketPsi_init = ket0 to the target state ketPsi_tgt = ket1, under the dynamics of the Hamiltonian opH(t):","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"function ket(label)\n    result = Dict(\"0\" => Vector{ComplexF64}([1, 0]), \"1\" => Vector{ComplexF64}([0, 1]))\n    return result[string(label)]\nend;\nnothing #hide","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"objectives = [Objective(initial_state = ket(0), generator = H, target_state = ket(1))]","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"problem = ControlProblem(\n    objectives = objectives,\n    tlist = tlist,\n    pulse_options=Dict(),\n    iter_stop = 500,\n    J_T = QuantumControl.functionals.J_T_sm,\n    gradient=QuantumControl.functionals.grad_J_T_sm!,\n    check_convergence = res -> begin\n        ((res.J_T < 1e-3) && (res.converged = true) && (res.message = \"J_T < 10⁻³\"))\n    end,\n);\nnothing #hide","category":"page"},{"location":"examples/simple_state_to_state/#Simulate-dynamics-under-the-guess-field","page":"Example 1 (TLS)","title":"Simulate dynamics under the guess field","text":"","category":"section"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"Before running the optimization procedure, we first simulate the dynamics under the guess field epsilon_0(t). The following solves equation of motion for the defined objective, which contains the initial state ketPsi_init and the Hamiltonian opH(t) defining its evolution.","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"guess_dynamics = propagate_objective(\n    objectives[1],\n    problem.tlist;\n    storage = true,\n    observables = (Ψ -> abs.(Ψ) .^ 2,),\n)","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"function plot_population(pop0::Vector, pop1::Vector, tlist)\n    fig, ax = matplotlib.pyplot.subplots(figsize = (6, 3))\n    ax.plot(tlist, pop0, label = \"0\")\n    ax.plot(tlist, pop1, label = \"1\")\n    ax.legend()\n    ax.set_xlabel(\"time\")\n    ax.set_ylabel(\"population\")\n    return fig\nend\n\nplot_population(guess_dynamics[1,:], guess_dynamics[2,:], tlist)","category":"page"},{"location":"examples/simple_state_to_state/#Optimize","page":"Example 1 (TLS)","title":"Optimize","text":"","category":"section"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"In the following we optimize the guess field epsilon_0(t) such that the intended state-to-state transfer ketPsi_init rightarrow ketPsi_tgt is solved.","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"opt_result = optimize_grape(\n        problem,\n        #=show_trace=true, extended_trace=false,=#\n        info_hook=chain_infohooks(\n            GRAPELinesearchAnalysis.plot_linesearch(@__DIR__),\n            GRAPE.print_table,\n        )\n        #=alphaguess=LineSearches.InitialStatic(alpha=0.2),=#\n        #=linesearch=LineSearches.HagerZhang(alphamax=2.0),=#\n        #=linesearch=LineSearches.BackTracking(), # fails=#\n        #=allow_f_increases=true,=#\n);\nnothing #hide","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"opt_result","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"We can plot the optimized field:","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"plot_control(opt_result.optimized_controls[1], tlist)","category":"page"},{"location":"examples/simple_state_to_state/#Simulate-the-dynamics-under-the-optimized-field","page":"Example 1 (TLS)","title":"Simulate the dynamics under the optimized field","text":"","category":"section"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"Having obtained the optimized control field, we can simulate the dynamics to verify that the optimized field indeed drives the initial state ketPsi_init = ket0 to the desired target state ketPsi_tgt = ket1.","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"opt_dynamics = propagate_objective(\n    objectives[1],\n    problem.tlist;\n    controls_map = IdDict(ϵ => opt_result.optimized_controls[1]),\n    storage = true,\n    observables = (Ψ -> abs.(Ψ) .^ 2,),\n)","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"plot_population(opt_dynamics[1,:], opt_dynamics[2,:], tlist)","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"","category":"page"},{"location":"examples/simple_state_to_state/","page":"Example 1 (TLS)","title":"Example 1 (TLS)","text":"This page was generated using Literate.jl.","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = GRAPE","category":"page"},{"location":"#GRAPE.jl","page":"Home","title":"GRAPE.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Julia implementation of Gradient Ascent Pulse engineering.","category":"page"},{"location":"#Overview","page":"Home","title":"Overview","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\n    \"overview.md\",\n]\nDepth = 1","category":"page"},{"location":"#Examples","page":"Home","title":"Examples","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\n    \"examples/simple_state_to_state.md\",\n]\nDepth = 1","category":"page"},{"location":"#API","page":"Home","title":"API","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\n    \"api.md\",\n]\nDepth = 1","category":"page"}]
}
